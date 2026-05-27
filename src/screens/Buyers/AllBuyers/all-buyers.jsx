import { useState, useEffect, useCallback } from "react";
import { Table, Popover, Pagination, Modal } from "antd";
import { AllBuyersWrapper } from "./all-buyers.styles";
import { useBuyers } from "@/hooks/useBuyers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suspendBuyer, unsuspendBuyer } from "@/network/buyers";
import useNotification from "@/hooks/useNotification";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/format-date";

const STATUS_FILTERS = ["all", "active", "suspended"];

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

function BuyerNameCell({ buyer }) {
  return (
    <div className="buyer__name__cell">
      <div className="buyer__avatar">{initials(buyer.fullName)}</div>
      <div className="buyer__info">
        <p className="buyer__fullname">{buyer.fullName}</p>
        <p className="buyer__email">{buyer.email}</p>
      </div>
    </div>
  );
}

function StatusPill({ buyer }) {
  if (buyer.isSuspended) return <span className="status__pill suspended"><span className="pill__dot" />Suspended</span>;
  if (!buyer.isConfirmed) return <span className="status__pill unverified"><span className="pill__dot" />Unverified</span>;
  return <span className="status__pill active"><span className="pill__dot" />Active</span>;
}

export default function AllBuyers() {
  const router = useRouter();
  const [success, error] = useNotification();
  const qc = useQueryClient();
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useBuyers(page, debounced);

  const buyers = data?.data?.body?.buyers || [];
  const total  = data?.data?.body?.pagination?.total || 0;

  const filtered = statusFilter === "all"
    ? buyers
    : statusFilter === "suspended"
      ? buyers.filter((b) => b.isSuspended)
      : buyers.filter((b) => !b.isSuspended && b.isConfirmed);

  const { mutate: suspend, isLoading: suspending } = useMutation({
    mutationFn: ({ id, reason }) => suspendBuyer(id, reason),
    onSuccess: () => { success("Buyer suspended"); qc.invalidateQueries({ queryKey: ["buyers"] }); },
    onError:   () => error("Failed to suspend buyer"),
  });

  const { mutate: unsuspend, isLoading: unsuspending } = useMutation({
    mutationFn: (id) => unsuspendBuyer(id),
    onSuccess: () => { success("Buyer unsuspended"); qc.invalidateQueries({ queryKey: ["buyers"] }); },
    onError:   () => error("Failed to unsuspend buyer"),
  });

  const menuStyle = { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 180, padding: 4 };

  const ActionMenu = useCallback(({ buyer }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const itemStyle = (key, danger) => ({
      width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6,
      border: 'none', fontSize: '.83rem', fontWeight: 500, cursor: 'pointer',
      fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .1s',
      color: danger ? '#dc2626' : '#111827',
      background: hoveredItem === key ? (danger ? '#fef2f2' : '#f5f5f5') : 'none',
    });
    return (
      <div style={menuStyle}>
        <button
          style={itemStyle('view')}
          onClick={() => router.push(`/buyer/${buyer.id}`)}
          onMouseEnter={() => setHoveredItem('view')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          View Profile
        </button>
        {buyer.isSuspended
          ? <button
              style={itemStyle('suspend')}
              onClick={() => unsuspend(buyer.id)}
              onMouseEnter={() => setHoveredItem('suspend')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Unsuspend
            </button>
          : <button
              style={itemStyle('suspend', true)}
              onClick={() => Modal.confirm({
                title: 'Suspend this buyer?',
                content: 'The buyer will lose access to their account.',
                okText: 'Suspend',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: () => suspend({ id: buyer.id, reason: 'Admin action' }),
              })}
              onMouseEnter={() => setHoveredItem('suspend')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Suspend Buyer
            </button>
        }
      </div>
    );
  }, [router, suspend, unsuspend]);

  const columns = [
    {
      title: "Buyer",
      key: "buyer",
      render: (_, row) => <BuyerNameCell buyer={row} />,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (v) => v || <span style={{ color: "#9ca3af" }}>—</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (v) => v || <span style={{ color: "#9ca3af" }}>—</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => <StatusPill buyer={row} />,
    },
    {
      title: "Joined",
      key: "joined",
      render: (_, row) => formatDate(row.createdAt),
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, row) => (
        <Popover content={<ActionMenu buyer={row} />} trigger="click" placement="bottomRight">
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, color: '#9ca3af' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllBuyersWrapper>
      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={16} />
          <input
            placeholder="Search buyers…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="filter__tabs">
          {STATUS_FILTERS.map((f) => (
            <button key={f} className={`${statusFilter === f ? "active" : ""}`} onClick={() => setStatusFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={isLoading || suspending || unsuspending}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          showSizeChanger: false,
          onChange: setPage,
        }}
        locale={{ emptyText: "No buyers found" }}
      />
    </AllBuyersWrapper>
  );
}

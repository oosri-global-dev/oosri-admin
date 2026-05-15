import { useState, useEffect, useCallback } from "react";
import { Table, Popover, Pagination } from "antd";
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

  const ActionMenu = useCallback(({ buyer }) => (
    <div className="action__menu">
      <div className="action__item" onClick={() => router.push(`/buyer/${buyer.id}`)}>View Profile</div>
      {buyer.isSuspended
        ? <div className="action__item" onClick={() => unsuspend(buyer.id)}>Unsuspend</div>
        : <div className="action__item danger" onClick={() => suspend({ id: buyer.id, reason: "Admin action" })}>Suspend</div>
      }
    </div>
  ), [router, suspend, unsuspend]);

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
          <EllipsisIcon size={20} style={{ cursor: "pointer", color: "#6b7280" }} />
        </Popover>
      ),
    },
  ];

  return (
    <AllBuyersWrapper>
      <div className="page__intro">
        <h2 className="section__title">Buyers</h2>
        <p className="section__sub">Manage all registered buyers on the platform.</p>
      </div>

      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={16} color="#9ca3af" />
          <input
            placeholder="Search buyers…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="filter__tabs">
          {STATUS_FILTERS.map((f) => (
            <button key={f} className={`tab__btn${statusFilter === f ? " active" : ""}`} onClick={() => setStatusFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table__card">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={isLoading || suspending || unsuspending}
          pagination={false}
        />
        {total > 20 && (
          <div className="pagination__row">
            <Pagination current={page} pageSize={20} total={total} onChange={setPage} showSizeChanger={false} />
          </div>
        )}
      </div>
    </AllBuyersWrapper>
  );
}

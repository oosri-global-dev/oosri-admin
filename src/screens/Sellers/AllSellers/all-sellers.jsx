import { useState, useEffect } from "react";
import { Table, Popover, Modal } from "antd";
import { AllSellersWrapper } from "./all-sellers.styles";
import { useSellers } from "@/hooks/useSellers";
import { formatDate } from "@/utils/format-date";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSeller, suspendSeller, unsuspendSeller } from "@/network/sellers";
import useNotification from "@/hooks/useNotification";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";

function initials(first = "", last = "") {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
}

function StatusPill({ seller }) {
  if (seller.isSuspended) {
    return <span className="pill suspended"><span className="dot" />Suspended</span>;
  }
  return seller.isVerified
    ? <span className="pill verified"><span className="dot" />Verified</span>
    : <span className="pill unverified"><span className="dot" />Unverified</span>;
}

const TABS = [
  { key: "all",        label: "All Sellers" },
  { key: "unverified", label: "Unverified"  },
  { key: "suspended",  label: "Suspended"   },
];

function ActionMenu({ seller, router, onDelete, onSuspend, onUnsuspend }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 188, padding: 4 }}>
      <button
        onClick={() => router.push(`/seller/${seller.id}`)}
        style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 6, border: "none", background: "none", fontSize: ".82rem", color: "#374151", cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
      >
        View Seller Details
      </button>
      {seller.isSuspended ? (
        <button
          onClick={() => onUnsuspend(seller.id)}
          style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 6, border: "none", background: "none", fontSize: ".82rem", color: "#16a34a", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          Unsuspend Seller
        </button>
      ) : (
        <button
          onClick={() => onSuspend(seller.id)}
          style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 6, border: "none", background: "none", fontSize: ".82rem", color: "#d97706", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#fffbeb"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          Suspend Seller
        </button>
      )}
      <button
        onClick={() => onDelete(seller.id, `${seller.firstName} ${seller.lastName}`)}
        style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 6, border: "none", background: "none", fontSize: ".82rem", color: "#dc2626", cursor: "pointer", fontFamily: "inherit" }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
      >
        Delete Seller
      </button>
    </div>
  );
}

export default function AllSellers() {
  const router = useRouter();
  const qc = useQueryClient();
  const [success, error] = useNotification();
  const [tab, setTab]             = useState("all");
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useSellers(debounced);
  const allSellers = data?.sellers || [];

  const sellers = (() => {
    if (tab === "unverified") return allSellers.filter((s) => !s.isVerified && !s.isSuspended);
    if (tab === "suspended")  return allSellers.filter((s) => s.isSuspended);
    return allSellers;
  })();

  const { mutate: doDelete } = useMutation({
    mutationFn: (id) => deleteSeller(id),
    onSuccess: () => { success("Seller deleted."); qc.invalidateQueries({ queryKey: ["sellers"] }); },
    onError:   () => error("Failed to delete seller."),
  });

  const { mutate: doSuspend } = useMutation({
    mutationFn: (id) => suspendSeller(id, "Suspended by admin"),
    onSuccess: () => { success("Seller suspended."); qc.invalidateQueries({ queryKey: ["sellers"] }); },
    onError:   () => error("Failed to suspend seller."),
  });

  const { mutate: doUnsuspend } = useMutation({
    mutationFn: (id) => unsuspendSeller(id),
    onSuccess: () => { success("Seller unsuspended."); qc.invalidateQueries({ queryKey: ["sellers"] }); },
    onError:   () => error("Failed to unsuspend seller."),
  });

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: "Delete this seller?",
      content: `"${name}" and all their products will be permanently removed. This cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => doDelete(id),
    });
  };

  const handleSuspend = (id) => {
    Modal.confirm({
      title: "Suspend this seller?",
      content: "The seller will lose access to their account. Their listings will remain but won't be purchasable.",
      okText: "Suspend",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => doSuspend(id),
    });
  };

  const columns = [
    {
      title: "Seller",
      key: "seller",
      render: (_, s) => (
        <div className="seller__cell">
          <div className="avatar">{initials(s.firstName, s.lastName)}</div>
          <p className="name">{s.firstName} {s.lastName}</p>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, s) => <span style={{ fontSize: '.82rem', color: '#374151' }}>{s.email || "—"}</span>,
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, s) => <span style={{ fontSize: '.82rem', color: '#374151' }}>{s.phone_number || "—"}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (v) => v || "—",
    },
    {
      title: "Joined",
      key: "joined",
      render: (_, s) => formatDate(s.createdAt) || "—",
    },
    {
      title: "Status",
      key: "status",
      render: (_, s) => <StatusPill seller={s} />,
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, s) => (
        <Popover
          content={
            <ActionMenu
              seller={s}
              router={router}
              onDelete={handleDelete}
              onSuspend={handleSuspend}
              onUnsuspend={(id) => doUnsuspend(id)}
            />
          }
          trigger="click"
          placement="bottomRight"
        >
          <button
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, color: "#9ca3af" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllSellersWrapper>
      <div className="screen__card">
        <div className="tab__bar">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab__btn${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search__box">
            <SearchIcon size={16} />
            <input
              placeholder="Search sellers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={sellers}
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No sellers found" }}
        />
      </div>
    </AllSellersWrapper>
  );
}

import { useState, useEffect } from "react";
import { Table, Select } from "antd";
import { OrderWrapper } from "./orders.styles";
import { useOrders } from "@/hooks/useOrders";
import { useMainContext } from "@/context";
import { SET_CURRENCY } from "@/context/types";
import { useRouter } from "next/router";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { formatDate } from "@/utils/format-date";

const STATUS_MAP = {
  "delivered":          "delivered",
  "processing":         "processing",
  "sent for pickup":    "pickup",
  "canceled":           "cancelled",
  "cancelled":          "cancelled",
  "pending":            "pending",
  "completed":          "completed",
  "on-hold":            "on-hold",
  "pending_logistics":  "pending_logistics",
};

const STATUS_TABS = [
  { key: "",                 label: "All"         },
  { key: "pending",          label: "Pending"     },
  { key: "processing",       label: "Processing"  },
  { key: "pending_logistics",label: "Shipped"     },
  { key: "completed",        label: "Completed"   },
  { key: "canceled",         label: "Cancelled"   },
  { key: "on-hold",          label: "On Hold"     },
];

function OrderStatusPill({ status }) {
  const key = STATUS_MAP[status?.toLowerCase()] || "processing";
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—";
  return (
    <span className={`pill ${key}`}>
      <span className="dot" />{label}
    </span>
  );
}

function PaymentPill({ status }) {
  const key = status?.toLowerCase() === "paid" ? "paid" : "pending";
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—";
  return <span className={`pill ${key}`}><span className="dot" />{label}</span>;
}

export default function OrderScreen() {
  const router = useRouter();
  const { state, dispatch } = useMainContext();
  const currency = state.currency || "NGN";

  const [statusTab, setStatusTab] = useState("");
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage]           = useState(1);
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when tab changes
  const handleTabChange = (key) => { setStatusTab(key); setPage(1); };

  const { data, isLoading } = useOrders(
    { skip: (page - 1) * limit, limit, orderStatus: statusTab || undefined },
    debounced
  );
  const orders = data?.body?.orders || [];
  const total  = data?.body?.totalPages ? data.body.totalPages * limit : 0;

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (id, row) => (
        <div>
          <p className="ref__cell">{id}</p>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{row.itemNum} item{row.itemNum !== 1 ? "s" : ""}</p>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (v) => v || "—",
    },
    {
      title: "Customer",
      dataIndex: "customerFullName",
      key: "customer",
      render: (v) => v || "—",
    },
    {
      title: `Amount (${currency === "USD" ? "$" : "₦"})`,
      key: "amount",
      render: (_, row) => (
        <span className="amount__cell">
          {currency === "USD" ? row.formattedAmountUSD : row.formattedAmountNGN}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (v) => <OrderStatusPill status={v} />,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (v) => <PaymentPill status={v} />,
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, row) => (
        <button
          onClick={() => router.push(`/order/${row.orderId}`)}
          style={{ fontSize: "0.78rem", color: "var(--oosriPrimary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <OrderWrapper>
      {/* Status filter tabs */}
      <div className="status__tabs__bar">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            className={`status__tab${statusTab === t.key ? " active" : ""}`}
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={16} />
          <input
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar__right">
          <Select
            value={currency}
            onChange={(v) => dispatch({ type: SET_CURRENCY, payload: v })}
            style={{ width: 110 }}
            options={[
              { value: "NGN", label: "NGN (₦)" },
              { value: "USD", label: "USD ($)" },
            ]}
          />
        </div>
      </div>

      <Table
        rowKey="orderId"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: false,
          onChange: (p) => setPage(p),
        }}
        locale={{ emptyText: "No orders found" }}
      />
    </OrderWrapper>
  );
}

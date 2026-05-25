import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BuyerWrapper } from "./buyer.styles";
import { useBuyer } from "@/hooks/useBuyer";
import { useOrders } from "@/hooks/useOrders";
import { suspendBuyer, unsuspendBuyer } from "@/network/buyers";
import useNotification from "@/hooks/useNotification";
import { Modal, Spin, Tabs, Table } from "antd";
import { formatDate } from "@/utils/format-date";
import { useRouter } from "next/router";
import Link from "next/link";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

function StatusPill({ buyer }) {
  if (buyer.isSuspended) return <span className="status__pill suspended"><span className="pill__dot" />Suspended</span>;
  if (!buyer.isConfirmed) return <span className="status__pill unverified"><span className="pill__dot" />Unverified</span>;
  return <span className="status__pill active"><span className="pill__dot" />Active</span>;
}

const ORDER_STATUS_STYLES = {
  pending:          { bg: '#fff7ed', color: '#c2410c' },
  processing:       { bg: '#fffbeb', color: '#b45309' },
  pending_logistics:{ bg: '#eff6ff', color: '#1d4ed8' },
  completed:        { bg: '#dcfce7', color: '#15803d' },
  delivered:        { bg: '#f0fdf4', color: '#16a34a' },
  canceled:         { bg: '#fff1f2', color: '#be123c' },
  cancelled:        { bg: '#fff1f2', color: '#be123c' },
  'on-hold':        { bg: '#f5f3ff', color: '#7c3aed' },
};

function OrdersTab({ buyerId }) {
  const router = useRouter();
  const { data, isLoading } = useOrders({ buyerId, limit: 20, skip: 0 }, "");
  const orders = data?.body?.orders || [];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (id) => <span style={{ fontFamily: "monospace", fontSize: ".78rem", color: "#6b7280" }}>{id}</span>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (v) => <span style={{ fontSize: ".82rem" }}>{v || "—"}</span>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, row) => (
        <span style={{ fontSize: ".84rem", fontWeight: 600, color: "#111827" }}>{row.formattedAmountNGN || "—"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      render: (v) => {
        const s = ORDER_STATUS_STYLES[v?.toLowerCase()] || ORDER_STATUS_STYLES.pending;
        const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : "—";
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: ".72rem", fontWeight: 700, background: s.bg, color: s.color }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
            {label}
          </span>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_, row) => (
        <Link href={`/order/${row.orderId}`} style={{ fontSize: ".78rem", color: "var(--oosriPrimary)", fontWeight: 600, textDecoration: "none" }}>
          View
        </Link>
      ),
    },
  ];

  if (isLoading) return <div style={{ padding: 40, display: "flex", justifyContent: "center" }}><Spin /></div>;

  return (
    <Table
      rowKey="orderId"
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      locale={{ emptyText: "No orders found for this buyer." }}
    />
  );
}

function AccountTab({ buyer }) {
  return (
    <div>
      <div className="details__grid">
        <div className="info__card">
          <h3 className="card__title">Account Details</h3>
          {[
            ["Full Name",      buyer.fullName    || "—"],
            ["Email",          buyer.email       || "—"],
            ["Phone",          buyer.phoneNumber || "—"],
            ["Gender",         buyer.gender      || "—"],
            ["Email Verified", buyer.isConfirmed ? "Yes" : "No"],
            ["Last Login",     buyer.lastLogin   || "—"],
            ["Joined",         buyer.createdAt ? formatDate(buyer.createdAt) : "—"],
          ].map(([label, value]) => (
            <div className="info__row" key={label}>
              <span className="info__label">{label}</span>
              <span className="info__value">{value}</span>
            </div>
          ))}
        </div>

        <div className="info__card">
          <h3 className="card__title">Auth Providers</h3>
          {[
            ["Google Linked",    buyer.authProviders?.googleLinked          ? "Yes" : "No"],
            ["Password Enabled", buyer.authProviders?.localPasswordEnabled  ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div className="info__row" key={label}>
              <span className="info__label">{label}</span>
              <span className="info__value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="addresses__card" style={{ marginTop: 16 }}>
        <h3 className="card__title">Delivery Addresses</h3>
        {(buyer.deliveryAddresses?.length || 0) === 0
          ? <p className="empty__text">No delivery addresses saved.</p>
          : buyer.deliveryAddresses.map((addr, i) => (
            <div className="address__item" key={i}>
              <p className="address__line">{addr.address}</p>
              <p className="address__meta">{addr.cityName}, {addr.countryName} {addr.postalCode}</p>
              {addr.isDefault && <span className="default__badge">Default</span>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default function BuyerScreen({ buyerId }) {
  const [success, error] = useNotification();
  const qc = useQueryClient();
  const { data, isLoading } = useBuyer(buyerId);
  const buyer = data?.data?.body || {};

  const { mutate: suspend, isLoading: suspending } = useMutation({
    mutationFn: (id) => suspendBuyer(id, "Admin action"),
    onSuccess: () => { success("Buyer suspended"); qc.invalidateQueries({ queryKey: ["buyer", buyerId] }); },
    onError:   () => error("Failed to suspend buyer"),
  });

  const { mutate: unsuspend, isLoading: unsuspending } = useMutation({
    mutationFn: (id) => unsuspendBuyer(id),
    onSuccess: () => { success("Buyer unsuspended"); qc.invalidateQueries({ queryKey: ["buyer", buyerId] }); },
    onError:   () => error("Failed to unsuspend buyer"),
  });

  if (isLoading) return <div style={{ padding: 60, textAlign: "center" }}><Spin size="large" /></div>;

  return (
    <BuyerWrapper>
      <div className="profile__card">
        <div className="profile__avatar">{initials(buyer.fullName)}</div>
        <div className="profile__main">
          <h2 className="profile__name">{buyer.fullName || "—"}</h2>
          <p className="profile__email">{buyer.email}</p>
          <div className="profile__badges">
            <StatusPill buyer={buyer} />
          </div>
        </div>
        <div className="profile__actions">
          {buyer.isSuspended
            ? <button className="btn__unsuspend" disabled={unsuspending} onClick={() => unsuspend(buyerId)}>
                {unsuspending ? "Unsuspending…" : "Unsuspend"}
              </button>
            : <button
                className="btn__suspend"
                disabled={suspending}
                onClick={() => Modal.confirm({
                  title: "Suspend this buyer?",
                  content: "The buyer will lose access to their account.",
                  okText: "Suspend",
                  okType: "danger",
                  cancelText: "Cancel",
                  onOk: () => suspend(buyerId),
                })}
              >
                {suspending ? "Suspending…" : "Suspend Buyer"}
              </button>
          }
        </div>
      </div>

      <Tabs
        defaultActiveKey="account"
        items={[
          { key: "account", label: "Account Details", children: <AccountTab buyer={buyer} /> },
          { key: "orders",  label: "Order History",   children: <OrdersTab  buyerId={buyerId} /> },
        ]}
        style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "8px 20px 20px" }}
      />
    </BuyerWrapper>
  );
}

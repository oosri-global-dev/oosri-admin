import { useState } from "react";
import { Table, Pagination } from "antd";
import { PayoutsWrapper } from "./payouts.styles";
import { usePayouts, useApprovePayout, useRejectPayout } from "@/hooks/usePayouts";
import useNotification from "@/hooks/useNotification";
import { formatDate } from "@/utils/format-date";

const STATUS_FILTERS = [
  { key: "",         label: "All"     },
  { key: "pending",  label: "Pending" },
  { key: "paid",     label: "Paid"    },
  { key: "failed",   label: "Failed"  },
];

function StatusPill({ status }) {
  return (
    <span className={`status__pill ${status || "pending"}`}>
      <span className="pill__dot" />
      {(status || "pending").charAt(0).toUpperCase() + (status || "pending").slice(1)}
    </span>
  );
}

function formatUSD(cents) {
  if (cents == null) return "—";
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNGN(kobo) {
  if (kobo == null) return null;
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export default function PayoutsScreen() {
  const [success, error] = useNotification();
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatus] = useState("");

  const { data, isLoading } = usePayouts(page, statusFilter);
  const payouts = data?.data?.body?.payouts || [];
  const total   = data?.data?.body?.pagination?.total || 0;

  const { mutate: approve, isLoading: approving } = useApprovePayout();
  const { mutate: reject,  isLoading: rejecting  } = useRejectPayout();

  const handleApprove = (id) => approve(id, {
    onSuccess: () => success("Payout approved"),
    onError:   () => error("Failed to approve payout"),
  });

  const handleReject = (id) => reject(id, {
    onSuccess: () => success("Payout rejected"),
    onError:   () => error("Failed to reject payout"),
  });

  const columns = [
    {
      title: "Reference",
      dataIndex: "payout_reference",
      key: "ref",
      render: (v) => <span style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{v || "—"}</span>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, row) => (
        <div className="amount__cell">
          <p className="usd">{formatUSD(row.total_usd_cents)}</p>
          {row.total_ngn_kobo != null && <p className="ngn">{formatNGN(row.total_ngn_kobo)}</p>}
        </div>
      ),
    },
    {
      title: "Initiated By",
      dataIndex: "initiated_by",
      key: "initiated",
      render: (v) => v || <span style={{ color: "#9ca3af" }}>—</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => <StatusPill status={row.status} />,
    },
    {
      title: "Date",
      key: "date",
      render: (_, row) => formatDate(row.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => {
        if (row.status !== "pending") return null;
        return (
          <div className="action__btns">
            <button className="btn__approve" disabled={approving} onClick={() => handleApprove(row.id || row._id)}>
              Approve
            </button>
            <button className="btn__reject" disabled={rejecting} onClick={() => handleReject(row.id || row._id)}>
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <PayoutsWrapper>
      <div className="page__intro">
        <h2 className="section__title">Payouts</h2>
        <p className="section__sub">Review and manage seller payout requests.</p>
      </div>

      <div className="toolbar">
        <div className="filter__tabs">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`tab__btn${statusFilter === key ? " active" : ""}`}
              onClick={() => { setStatus(key); setPage(1); }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="table__card">
        <Table
          columns={columns}
          dataSource={payouts}
          rowKey={(row) => row.id || row._id}
          loading={isLoading || approving || rejecting}
          pagination={false}
        />
        {total > 20 && (
          <div className="pagination__row">
            <Pagination current={page} pageSize={20} total={total} onChange={setPage} showSizeChanger={false} />
          </div>
        )}
      </div>
    </PayoutsWrapper>
  );
}

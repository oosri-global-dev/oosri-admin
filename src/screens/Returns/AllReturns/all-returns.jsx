import { useState, useEffect } from "react";
import { Table, Pagination, Popover, Switch, Modal, message } from "antd";
import { AllReturnsWrapper, SettingsPanelWrapper } from "./all-returns.styles";
import { useReturns, useReturnSettings } from "@/hooks/useReturns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveReturn,
  rejectReturn,
  triggerRefund,
  closeReturn,
  updateReturnSettings,
} from "@/network/returns";
import { useRouter } from "next/router";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import { usePermission } from "@/hooks/usePermission";

const STATUS_FILTERS = [
  { label: "All",       value: "" },
  { label: "Pending",   value: "pending" },
  { label: "Escalated", value: "escalated" },
  { label: "Approved",  value: "admin_approved" },
  { label: "Refunded",  value: "refunded" },
  { label: "Rejected",  value: "admin_rejected" },
  { label: "Closed",    value: "closed" },
];

const STATUS_LABELS = {
  pending: "Pending",
  seller_approved: "Seller Approved",
  seller_rejected: "Seller Rejected",
  escalated: "Escalated",
  admin_approved: "Approved",
  admin_rejected: "Rejected",
  refund_initiated: "Refund Initiated",
  refunded: "Refunded",
  closed: "Closed",
};

function StatusPill({ status }) {
  return (
    <span className={`status__pill ${status}`}>
      <span className="pill__dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function ActionsMenu({ record, onApprove, onReject, onRefund, onClose }) {
  const canApprove = ["pending", "seller_approved", "escalated"].includes(record.status);
  const canReject  = ["pending", "seller_approved", "seller_rejected", "escalated"].includes(record.status);
  const canRefund  = record.status === "admin_approved";
  const canClose   = !["refunded", "closed"].includes(record.status);

  return (
    <div className="action__menu">
      {canApprove && (
        <div className="action__item primary" onClick={() => onApprove(record)}>
          Approve & Set Refund
        </div>
      )}
      {canRefund && (
        <div className="action__item primary" onClick={() => onRefund(record)}>
          Trigger Refund
        </div>
      )}
      {canReject && (
        <div className="action__item danger" onClick={() => onReject(record)}>
          Reject
        </div>
      )}
      {canClose && (
        <div className="action__item" onClick={() => onClose(record)}>
          Close
        </div>
      )}
    </div>
  );
}

// ── Settings Panel ────────────────────────────────────────────────────────────

function SettingsPanel({ onClose }) {
  const qc = useQueryClient();
  const { data } = useReturnSettings();
  const current = data?.body || {};

  const [form, setForm] = useState({
    enabled: true,
    windowDays: 14,
    shippingCostBearer: "buyer",
    refundType: "admin_decides",
    maxRefundPercent: 100,
    requireEvidence: true,
    autoApprove: false,
  });

  useEffect(() => {
    if (current && Object.keys(current).length) {
      setForm({
        enabled:            current.enabled           ?? true,
        windowDays:         current.windowDays        ?? 14,
        shippingCostBearer: current.shippingCostBearer ?? "buyer",
        refundType:         current.refundType         ?? "admin_decides",
        maxRefundPercent:   current.maxRefundPercent   ?? 100,
        requireEvidence:    current.requireEvidence    ?? true,
        autoApprove:        current.autoApprove        ?? false,
      });
    }
  }, [data]);

  const { mutate: save, isLoading } = useMutation({
    mutationFn: () => updateReturnSettings(form),
    onSuccess: () => {
      qc.invalidateQueries(["returns", "settings"]);
      message.success("Settings saved");
      onClose();
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to save settings"),
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <SettingsPanelWrapper>
      <p className="settings__title">
        Return &amp; Refund Settings
        <span style={{ fontSize: "0.76rem", color: "#9ca3af", fontWeight: 400 }}>
          Super admin only
        </span>
      </p>

      <div className="toggle__row">
        <div className="toggle__label">
          <p className="toggle__name">Enable Returns &amp; Refunds</p>
          <p className="toggle__desc">Buyers can submit return requests when enabled</p>
        </div>
        <Switch checked={form.enabled} onChange={(v) => set("enabled", v)} />
      </div>

      <div className="toggle__row">
        <div className="toggle__label">
          <p className="toggle__name">Require Evidence</p>
          <p className="toggle__desc">Buyers must upload photos/docs with their request</p>
        </div>
        <Switch checked={form.requireEvidence} onChange={(v) => set("requireEvidence", v)} />
      </div>

      <div className="toggle__row">
        <div className="toggle__label">
          <p className="toggle__name">Auto-Approve Returns</p>
          <p className="toggle__desc">Automatically approve all incoming return requests</p>
        </div>
        <Switch checked={form.autoApprove} onChange={(v) => set("autoApprove", v)} />
      </div>

      <div className="settings__grid" style={{ marginTop: 20 }}>
        <div className="setting__item">
          <label>Return Window (days)</label>
          <input
            type="number"
            min={1} max={90}
            value={form.windowDays}
            onChange={(e) => set("windowDays", parseInt(e.target.value) || 14)}
          />
          <span className="setting__desc">How many days after delivery a buyer can request a return</span>
        </div>

        <div className="setting__item">
          <label>Shipping Cost Bearer</label>
          <select value={form.shippingCostBearer} onChange={(e) => set("shippingCostBearer", e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="platform">Platform</option>
          </select>
        </div>

        <div className="setting__item">
          <label>Refund Type</label>
          <select value={form.refundType} onChange={(e) => set("refundType", e.target.value)}>
            <option value="admin_decides">Admin Decides</option>
            <option value="full">Always Full Refund</option>
            <option value="partial">Always Partial Refund</option>
          </select>
          <span className="setting__desc">
            "Admin Decides" lets you choose per request
          </span>
        </div>

        <div className="setting__item">
          <label>Max Refund % (for partial)</label>
          <input
            type="number"
            min={1} max={100}
            value={form.maxRefundPercent}
            onChange={(e) => set("maxRefundPercent", parseInt(e.target.value) || 100)}
          />
        </div>
      </div>

      <button className="save__btn" disabled={isLoading} onClick={() => save()}>
        {isLoading ? "Saving…" : "Save Settings"}
      </button>
    </SettingsPanelWrapper>
  );
}

// ── Approve Modal ─────────────────────────────────────────────────────────────

function ApproveModal({ record, onDone, onCancel }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [refundType, setRefundType] = useState("full");
  const [amountCents, setAmountCents] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => approveReturn(record.id || record._id, {
      note,
      refundType,
      refundAmountCents: refundType === "partial" ? parseInt(amountCents) : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries(["returns"]);
      message.success("Return approved");
      onDone();
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to approve"),
  });

  return (
    <Modal
      open
      title="Approve Return Request"
      onCancel={onCancel}
      onOk={() => mutate()}
      confirmLoading={isLoading}
      okText="Approve"
      okButtonProps={{ style: { background: "#16a34a", borderColor: "#16a34a" } }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Refund Type</label>
          <select
            value={refundType}
            onChange={(e) => setRefundType(e.target.value)}
            style={{ width: "100%", marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px", fontFamily: "inherit", fontSize: "0.84rem" }}
          >
            <option value="full">Full Refund</option>
            <option value="partial">Partial Refund</option>
          </select>
        </div>
        {refundType === "partial" && (
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Refund Amount (cents)</label>
            <input
              type="number"
              min={1}
              value={amountCents}
              onChange={(e) => setAmountCents(e.target.value)}
              placeholder="e.g. 5000 = $50.00"
              style={{ width: "100%", marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px", fontFamily: "inherit", fontSize: "0.84rem" }}
            />
          </div>
        )}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Internal note for this decision"
            style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontFamily: "inherit", fontSize: "0.84rem", resize: "vertical" }}
          />
        </div>
      </div>
    </Modal>
  );
}

// ── Reject / Close shared modal ───────────────────────────────────────────────

function NoteModal({ title, okText, okDanger = false, onConfirm, onCancel, isLoading }) {
  const [note, setNote] = useState("");
  return (
    <Modal
      open
      title={title}
      onCancel={onCancel}
      onOk={() => onConfirm(note)}
      confirmLoading={isLoading}
      okText={okText}
      okButtonProps={okDanger ? { danger: true } : {}}
    >
      <div style={{ marginTop: 8 }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Reason or comment"
          style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontFamily: "inherit", fontSize: "0.84rem", resize: "vertical" }}
        />
      </div>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function AllReturns() {
  const router = useRouter();
  const qc = useQueryClient();
  const { isSuperAdmin } = usePermission();

  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [debounced, setDebounced]   = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [approving, setApproving]   = useState(null);
  const [rejecting, setRejecting]   = useState(null);
  const [closing, setClosing]       = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useReturns({ page, status: statusFilter, search: debounced });
  const returns = data?.body?.returns || [];
  const total   = data?.body?.total   || 0;

  const refundMutation = useMutation({
    mutationFn: (id) => triggerRefund(id),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Refund processed successfully"); },
    onError: (err) => message.error(err?.response?.data?.message || "Refund failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }) => rejectReturn(id, { note }),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Return rejected"); setRejecting(null); },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to reject"),
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, note }) => closeReturn(id, { note }),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Return closed"); setClosing(null); },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to close"),
  });

  const handleRefund = (record) => {
    const id = record.id || record._id;
    Modal.confirm({
      title: "Trigger Refund",
      content: "This will initiate the refund via the payment gateway. Continue?",
      okText: "Yes, Refund",
      okButtonProps: { style: { background: "#7c3aed", borderColor: "#7c3aed" } },
      onOk: () => refundMutation.mutate(id),
    });
  };

  const columns = [
    {
      title: "Order",
      key: "order",
      render: (_, r) => (
        <span style={{ fontSize: "0.82rem", color: "#6b7280", fontFamily: "monospace" }}>
          #{String(r.orderId?._id || r.orderId).slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Buyer",
      key: "buyer",
      render: (_, r) => (
        <div>
          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
            {r.buyerId?.fullName || "—"}
          </p>
          <p style={{ margin: 0, fontSize: "0.74rem", color: "#9ca3af" }}>
            {r.buyerId?.email || ""}
          </p>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (v) => <span className="reason__badge">{(v || "").replace(/_/g, " ")}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) => <StatusPill status={v} />,
    },
    {
      title: "Submitted",
      dataIndex: "createdAt",
      render: (v) => v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    },
    {
      title: "",
      key: "actions",
      width: 48,
      render: (_, record) => (
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <ActionsMenu
              record={record}
              onApprove={(r) => setApproving(r)}
              onReject={(r) => setRejecting(r)}
              onRefund={handleRefund}
              onClose={(r) => setClosing(r)}
            />
          }
        >
          <button
            onClick={(e) => e.stopPropagation()}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6 }}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllReturnsWrapper>
      <div className="section__header">
        <h2 className="section__title">Returns &amp; Refunds</h2>
        <p className="section__sub">Manage buyer return requests and process refunds</p>
      </div>

      {showSettings && isSuperAdmin && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={15} />
          <input
            placeholder="Search by buyer name or order ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="filter__tabs">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                className={statusFilter === f.value ? "active" : ""}
                onClick={() => { setStatus(f.value); setPage(1); }}
              >
                {f.label}
              </button>
            ))}
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => setShowSettings((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                height: 36, padding: "0 14px", border: "1px solid #e5e7eb",
                borderRadius: 8, background: "#fff", cursor: "pointer",
                fontSize: "0.8rem", fontWeight: 600, color: "#374151", fontFamily: "inherit",
              }}
            >
              <SettingsIcon size={14} />
              Settings
            </button>
          )}
        </div>
      </div>

      <div className="table__card">
        <Table
          rowKey={(r) => String(r.id || r._id)}
          dataSource={returns}
          columns={columns}
          loading={isLoading}
          pagination={false}
          onRow={(record) => ({
            onClick: () => router.push(`/returns/${record.id || record._id}`),
          })}
        />
        <div className="pagination__row">
          <Pagination
            current={page}
            pageSize={10}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
          />
        </div>
      </div>

      {approving && (
        <ApproveModal
          record={approving}
          onDone={() => setApproving(null)}
          onCancel={() => setApproving(null)}
        />
      )}

      {rejecting && (
        <NoteModal
          title="Reject Return Request"
          okText="Reject"
          okDanger
          isLoading={rejectMutation.isLoading}
          onConfirm={(note) => rejectMutation.mutate({ id: rejecting.id || rejecting._id, note })}
          onCancel={() => setRejecting(null)}
        />
      )}

      {closing && (
        <NoteModal
          title="Close Return Request"
          okText="Close"
          isLoading={closeMutation.isLoading}
          onConfirm={(note) => closeMutation.mutate({ id: closing.id || closing._id, note })}
          onCancel={() => setClosing(null)}
        />
      )}
    </AllReturnsWrapper>
  );
}

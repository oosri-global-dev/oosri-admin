import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReturn } from "@/hooks/useReturns";
import { approveReturn, rejectReturn, triggerRefund, closeReturn } from "@/network/returns";
import { Modal, message, Timeline } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;

  .card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px 24px;
  }
  .card__title {
    font-size: 0.78rem; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: .05em;
    margin: 0 0 16px; padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }
  .detail__grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;
  }
  .detail__item {
    .detail__label { font-size: 0.74rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing:.04em; margin-bottom: 4px; }
    .detail__value { font-size: 0.88rem; color: #111827; font-weight: 500; }
  }

  .status__pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }
    &.pending         { background: #fffbeb; color: #b45309; .pill__dot { background: #f59e0b; } }
    &.seller_approved { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.seller_rejected { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.escalated       { background: #fef3c7; color: #92400e; .pill__dot { background: #f59e0b; } }
    &.admin_approved  { background: #eff6ff; color: #1d4ed8; .pill__dot { background: #3b82f6; } }
    &.admin_rejected  { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
    &.refund_initiated { background: #f5f3ff; color: #6d28d9; .pill__dot { background: #7c3aed; } }
    &.refunded        { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.closed          { background: #f9fafb; color: #6b7280; .pill__dot { background: #9ca3af; } }
  }

  .action__bar {
    display: flex; gap: 10px; flex-wrap: wrap;
    button {
      height: 36px; padding: 0 18px; border-radius: 8px;
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      font-family: inherit; border: 1px solid transparent; transition: opacity .15s;
      &:hover { opacity: 0.85; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
    .btn__approve { background: #16a34a; color: #fff; }
    .btn__refund  { background: #7c3aed; color: #fff; }
    .btn__reject  { background: #fff; color: #dc2626; border-color: #fca5a5; }
    .btn__close   { background: #f3f4f6; color: #374151; }
  }

  .evidence__grid {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px;
    img {
      width: 90px; height: 90px; object-fit: cover;
      border-radius: 8px; border: 1px solid #e5e7eb;
      cursor: pointer;
    }
    a {
      font-size: 0.8rem; color: var(--oosriPrimary); word-break: break-all;
    }
  }
`;

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

function ApproveModal({ returnId, onDone, onCancel }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [refundType, setRefundType] = useState("full");
  const [amountCents, setAmountCents] = useState("");
  const { mutate, isLoading } = useMutation({
    mutationFn: () => approveReturn(returnId, {
      note,
      refundType,
      refundAmountCents: refundType === "partial" ? parseInt(amountCents) : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries(["returns"]);
      message.success("Return approved");
      onDone();
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed"),
  });

  return (
    <Modal open title="Approve Return" onCancel={onCancel} onOk={() => mutate()}
      confirmLoading={isLoading} okText="Approve"
      okButtonProps={{ style: { background: "#16a34a", borderColor: "#16a34a" } }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Refund Type</label>
          <select value={refundType} onChange={(e) => setRefundType(e.target.value)}
            style={{ width: "100%", marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px", fontFamily: "inherit", fontSize: "0.84rem" }}>
            <option value="full">Full Refund</option>
            <option value="partial">Partial Refund</option>
          </select>
        </div>
        {refundType === "partial" && (
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Amount (cents)</label>
            <input type="number" min={1} value={amountCents} onChange={(e) => setAmountCents(e.target.value)}
              placeholder="e.g. 5000 = $50.00"
              style={{ width: "100%", marginTop: 6, height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px", fontFamily: "inherit", fontSize: "0.84rem" }} />
          </div>
        )}
        <div>
          <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontFamily: "inherit", fontSize: "0.84rem", resize: "vertical" }} />
        </div>
      </div>
    </Modal>
  );
}

export default function ReturnDetail({ id }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading } = useReturn(id);
  const request = data?.body || null;

  const [approving, setApproving] = useState(false);

  const rejectMut = useMutation({
    mutationFn: (note) => rejectReturn(id, { note }),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Rejected"); },
    onError: (err) => message.error(err?.response?.data?.message || "Failed"),
  });

  const refundMut = useMutation({
    mutationFn: () => triggerRefund(id),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Refund initiated"); },
    onError: (err) => message.error(err?.response?.data?.message || "Refund failed"),
  });

  const closeMut = useMutation({
    mutationFn: (note) => closeReturn(id, { note }),
    onSuccess: () => { qc.invalidateQueries(["returns"]); message.success("Closed"); },
    onError: (err) => message.error(err?.response?.data?.message || "Failed"),
  });

  const handleReject = () => {
    Modal.confirm({
      title: "Reject Return Request",
      content: (
        <textarea
          id="reject-note"
          rows={3}
          placeholder="Reason (optional)"
          style={{ width: "100%", marginTop: 8, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontFamily: "inherit", fontSize: "0.84rem" }}
        />
      ),
      okText: "Reject", okType: "danger",
      onOk: () => {
        const note = document.getElementById("reject-note")?.value || "";
        rejectMut.mutate(note);
      },
    });
  };

  const handleRefund = () => {
    Modal.confirm({
      title: "Trigger Refund",
      content: "This will call the payment gateway and issue the refund. Continue?",
      okText: "Yes, Refund",
      okButtonProps: { style: { background: "#7c3aed", borderColor: "#7c3aed" } },
      onOk: () => refundMut.mutate(),
    });
  };

  const handleClose = () => {
    Modal.confirm({
      title: "Close Return Request",
      content: "Mark this request as closed without a refund?",
      okText: "Close",
      onOk: () => closeMut.mutate(""),
    });
  };

  if (isLoading) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading…</div>;
  if (!request)  return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Return request not found.</div>;

  const canApprove = ["pending", "seller_approved", "escalated"].includes(request.status);
  const canReject  = ["pending", "seller_approved", "seller_rejected", "escalated"].includes(request.status);
  const canRefund  = request.status === "admin_approved";
  const canClose   = !["refunded", "closed"].includes(request.status);

  const order   = request.orderId || {};
  const buyer   = request.buyerId || {};
  const seller  = request.sellerId || {};
  const payment = request.paymentId || {};

  return (
    <Wrapper>

      {/* Action bar */}
      <div className="action__bar">
        <button onClick={() => router.back()} className="btn__close">← Back</button>
        {canApprove && <button className="btn__approve" onClick={() => setApproving(true)}>Approve &amp; Set Refund</button>}
        {canRefund  && <button className="btn__refund"  onClick={handleRefund} disabled={refundMut.isLoading}>Trigger Refund</button>}
        {canReject  && <button className="btn__reject"  onClick={handleReject}>Reject</button>}
        {canClose   && !["admin_rejected"].includes(request.status) && (
          <button className="btn__close" onClick={handleClose}>Close</button>
        )}
      </div>

      {/* Summary */}
      <div className="card">
        <p className="card__title">Summary</p>
        <div className="detail__grid">
          <div className="detail__item">
            <p className="detail__label">Status</p>
            <StatusPill status={request.status} />
          </div>
          <div className="detail__item">
            <p className="detail__label">Reason</p>
            <p className="detail__value" style={{ textTransform: "capitalize" }}>
              {(request.reason || "").replace(/_/g, " ")}
            </p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Refund Type</p>
            <p className="detail__value">{request.refundType ? request.refundType.replace(/_/g, " ") : "—"}</p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Refund Amount</p>
            <p className="detail__value">
              {request.refundAmountCents != null
                ? `$${(request.refundAmountCents / 100).toFixed(2)}`
                : "—"}
            </p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Submitted</p>
            <p className="detail__value">
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Resolved</p>
            <p className="detail__value">
              {request.resolvedAt
                ? new Date(request.resolvedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
          {request.gatewayRefundId && (
            <div className="detail__item">
              <p className="detail__label">Gateway Refund ID</p>
              <p className="detail__value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{request.gatewayRefundId}</p>
            </div>
          )}
        </div>
        {request.reasonDetail && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: "0.74rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>Buyer's Description</p>
            <p style={{ fontSize: "0.88rem", color: "#374151", margin: 0 }}>{request.reasonDetail}</p>
          </div>
        )}
      </div>

      {/* Buyer & Order */}
      <div className="card">
        <p className="card__title">Buyer &amp; Order</p>
        <div className="detail__grid">
          <div className="detail__item">
            <p className="detail__label">Buyer</p>
            <p className="detail__value">{buyer.fullName || "—"}</p>
            <p style={{ fontSize: "0.74rem", color: "#9ca3af", margin: "2px 0 0" }}>{buyer.email || ""}</p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Seller</p>
            <p className="detail__value">{seller.firstName ? `${seller.firstName} ${seller.lastName}` : "—"}</p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Order ID</p>
            <p className="detail__value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>
              #{String(order._id || order).slice(-10).toUpperCase()}
            </p>
          </div>
          <div className="detail__item">
            <p className="detail__label">Order Status</p>
            <p className="detail__value" style={{ textTransform: "capitalize" }}>{order.orderStatus || "—"}</p>
          </div>
        </div>
      </div>

      {/* Payment */}
      {payment && payment.gateway && (
        <div className="card">
          <p className="card__title">Payment</p>
          <div className="detail__grid">
            <div className="detail__item">
              <p className="detail__label">Gateway</p>
              <p className="detail__value" style={{ textTransform: "capitalize" }}>{payment.gateway}</p>
            </div>
            <div className="detail__item">
              <p className="detail__label">Gross Amount</p>
              <p className="detail__value">
                {payment.gross_amount_cents != null
                  ? `$${(payment.gross_amount_cents / 100).toFixed(2)}`
                  : "—"}
              </p>
            </div>
            <div className="detail__item">
              <p className="detail__label">Payment Status</p>
              <p className="detail__value" style={{ textTransform: "capitalize" }}>{payment.status || "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Evidence */}
      {request.evidenceUrls?.length > 0 && (
        <div className="card">
          <p className="card__title">Evidence</p>
          <div className="evidence__grid">
            {request.evidenceUrls.map((url, i) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
              return isImage
                ? <img key={i} src={url} alt={`Evidence ${i + 1}`} onClick={() => window.open(url, "_blank")} />
                : <a key={i} href={url} target="_blank" rel="noreferrer">{url}</a>;
            })}
          </div>
        </div>
      )}

      {/* Admin/Seller notes */}
      {(request.adminNote || request.sellerNote) && (
        <div className="card">
          <p className="card__title">Notes</p>
          {request.adminNote && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.74rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>Admin Note</p>
              <p style={{ fontSize: "0.88rem", color: "#374151", margin: 0 }}>{request.adminNote}</p>
            </div>
          )}
          {request.sellerNote && (
            <div>
              <p style={{ fontSize: "0.74rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>Seller Note</p>
              <p style={{ fontSize: "0.88rem", color: "#374151", margin: 0 }}>{request.sellerNote}</p>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      {request.timeline?.length > 0 && (
        <div className="card">
          <p className="card__title">Activity Timeline</p>
          <Timeline
            items={request.timeline.map((t) => ({
              children: (
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "0.84rem", fontWeight: 600, color: "#111827", textTransform: "capitalize" }}>
                    {(t.status || "").replace(/_/g, " ")}
                  </p>
                  {t.note && <p style={{ margin: "0 0 2px", fontSize: "0.8rem", color: "#6b7280" }}>{t.note}</p>}
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#9ca3af" }}>
                    {t.actorName || t.actorType || "System"} ·{" "}
                    {t.timestamp ? new Date(t.timestamp).toLocaleString("en-GB") : ""}
                  </p>
                </div>
              ),
            }))}
          />
        </div>
      )}

      {approving && (
        <ApproveModal
          returnId={id}
          onDone={() => setApproving(false)}
          onCancel={() => setApproving(false)}
        />
      )}
    </Wrapper>
  );
}

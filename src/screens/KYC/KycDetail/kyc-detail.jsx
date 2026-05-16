import { useState } from "react";
import { Modal, Input, message, Spin } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveKyc, rejectKyc } from "@/network/kyc";
import { useRouter } from "next/router";
import styled from "styled-components";

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .detail__card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
  }

  .card__title {
    font-size: 0.9rem; font-weight: 700; color: #111827;
    margin: 0 0 16px; padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .info__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .info__item {
    label { font-size: 0.72rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .04em; display: block; margin-bottom: 4px; }
    .info__val { font-size: 0.88rem; color: #111827; font-weight: 500; }
  }

  .status__pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    .pill__dot { width: 6px; height: 6px; border-radius: 50%; }
    &.pending  { background: #fffbeb; color: #b45309; .pill__dot { background: #f59e0b; } }
    &.approved { background: #f0fdf4; color: #15803d; .pill__dot { background: #16a34a; } }
    &.rejected { background: #fef2f2; color: #b91c1c; .pill__dot { background: #dc2626; } }
  }

  .doc__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  .doc__card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    .doc__label {
      font-size: 0.74rem; font-weight: 600; color: #6b7280;
      padding: 8px 10px; background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      text-transform: uppercase; letter-spacing: .04em;
    }
    .doc__preview {
      padding: 12px;
      a {
        font-size: 0.82rem; color: var(--oosriPrimary);
        text-decoration: none; font-weight: 600;
        display: flex; align-items: center; gap: 6px;
        &:hover { text-decoration: underline; }
      }
      img {
        max-width: 100%; border-radius: 6px;
        display: block; margin-bottom: 8px;
      }
    }
  }

  .timeline__list {
    display: flex; flex-direction: column; gap: 12px;
    .tl__item {
      display: flex; gap: 12px;
      .tl__dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
      .tl__body {
        .tl__status { font-size: 0.84rem; font-weight: 700; color: #111827; text-transform: capitalize; }
        .tl__note   { font-size: 0.78rem; color: #6b7280; }
        .tl__date   { font-size: 0.72rem; color: #9ca3af; }
      }
    }
  }

  .action__bar {
    display: flex; gap: 12px; flex-wrap: wrap;
    button {
      height: 38px; padding: 0 20px;
      border-radius: 8px; font-size: 0.84rem; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: opacity .15s;
      border: 1.5px solid transparent;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .btn__approve { background: #16a34a; color: #fff; &:hover { opacity: 0.88; } }
    .btn__reject  { background: #fff; color: #dc2626; border-color: #dc2626; &:hover { background: #fef2f2; } }
    .btn__back    { background: #fff; color: #374151; border-color: #e5e7eb; &:hover { background: #f9fafb; } }
  }
`;

const DOT_COLORS = { pending: "#f59e0b", approved: "#16a34a", rejected: "#dc2626" };

function DocLink({ url, label }) {
  if (!url) return <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Not provided</span>;
  const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
  return (
    <div className="doc__card">
      <div className="doc__label">{label}</div>
      <div className="doc__preview">
        {isImage && <img src={url} alt={label} />}
        <a href={url} target="_blank" rel="noreferrer">
          {isImage ? "Open full size ↗" : "View Document ↗"}
        </a>
      </div>
    </div>
  );
}

export default function KycDetail({ kyc }) {
  const router = useRouter();
  const qc = useQueryClient();

  const [rejectOpen, setRejectOpen]   = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const approveMut = useMutation({
    mutationFn: () => approveKyc(kyc.id),
    onSuccess: () => {
      message.success("KYC approved");
      qc.invalidateQueries({ queryKey: ['kyc'] });
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed"),
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectKyc(kyc.id, rejectReason),
    onSuccess: () => {
      message.success("KYC rejected");
      setRejectOpen(false);
      qc.invalidateQueries({ queryKey: ['kyc'] });
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed"),
  });

  const seller = kyc?.sellerId || {};
  const docs   = kyc?.documents || {};
  const canAct = kyc?.status !== "approved";

  return (
    <DetailWrapper>
      <div className="action__bar">
        <button className="btn__back" onClick={() => router.push("/kyc")}>← Back</button>
        {canAct && (
          <>
            <button
              className="btn__approve"
              disabled={approveMut.isPending}
              onClick={() => approveMut.mutate()}
            >
              {approveMut.isPending ? "Approving…" : "Approve KYC"}
            </button>
            <button
              className="btn__reject"
              disabled={rejectMut.isPending}
              onClick={() => { setRejectOpen(true); setRejectReason(""); }}
            >
              Reject KYC
            </button>
          </>
        )}
      </div>

      <div className="detail__card">
        <p className="card__title">Seller Information</p>
        <div className="info__grid">
          <div className="info__item">
            <label>Name</label>
            <span className="info__val">{seller.firstName} {seller.lastName}</span>
          </div>
          <div className="info__item">
            <label>Email</label>
            <span className="info__val">{seller.email}</span>
          </div>
          <div className="info__item">
            <label>Business Type</label>
            <span className="info__val">{seller.businessType || "—"}</span>
          </div>
          <div className="info__item">
            <label>Account Status</label>
            <span className="info__val">{seller.sellerStatus || "—"}</span>
          </div>
          <div className="info__item">
            <label>KYC Status</label>
            <span className={`status__pill ${kyc.status}`}>
              <span className="pill__dot" />
              {kyc.status}
            </span>
          </div>
          <div className="info__item">
            <label>Submitted</label>
            <span className="info__val">{kyc.submittedAt ? new Date(kyc.submittedAt).toLocaleString() : "—"}</span>
          </div>
          {kyc.reviewedAt && (
            <div className="info__item">
              <label>Reviewed</label>
              <span className="info__val">{new Date(kyc.reviewedAt).toLocaleString()}</span>
            </div>
          )}
          {kyc.rejectionReason && (
            <div className="info__item" style={{ gridColumn: "1 / -1" }}>
              <label>Rejection Reason</label>
              <span className="info__val" style={{ color: "#dc2626" }}>{kyc.rejectionReason}</span>
            </div>
          )}
        </div>
      </div>

      <div className="detail__card">
        <p className="card__title">Submitted Documents</p>
        <div className="doc__grid">
          <DocLink url={docs.governmentId}       label="Government ID" />
          <DocLink url={docs.proofOfAddress}     label="Proof of Address" />
          <DocLink url={docs.businessCertificate} label="Business Certificate" />
        </div>
      </div>

      {kyc.timeline?.length > 0 && (
        <div className="detail__card">
          <p className="card__title">Timeline</p>
          <div className="timeline__list">
            {[...kyc.timeline].reverse().map((entry, i) => (
              <div key={i} className="tl__item">
                <div className="tl__dot" style={{ background: DOT_COLORS[entry.status] || "#9ca3af" }} />
                <div className="tl__body">
                  <div className="tl__status">{entry.status}</div>
                  {entry.note && <div className="tl__note">{entry.note}</div>}
                  <div className="tl__date">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        title="Reject KYC Application"
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={() => rejectMut.mutate()}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true, loading: rejectMut.isPending }}
      >
        <p style={{ marginBottom: 12, color: "#6b7280", fontSize: "0.87rem" }}>
          Provide a reason — this will be emailed to the seller so they can correct and resubmit.
        </p>
        <Input.TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Government ID is blurry, please upload a clearer scan"
        />
      </Modal>
    </DetailWrapper>
  );
}

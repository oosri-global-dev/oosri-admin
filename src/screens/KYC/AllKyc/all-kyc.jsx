import { useState, useCallback } from "react";
import { Table, Pagination, Popover, Modal, Input, message } from "antd";
import { AllKycWrapper } from "./all-kyc.styles";
import { useKycList } from "@/hooks/useKyc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveKyc, rejectKyc } from "@/network/kyc";
import { useRouter } from "next/router";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function StatusPill({ status }) {
  const labels = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
  return (
    <span className={`status__pill ${status}`}>
      <span className="pill__dot" />
      {labels[status] || status}
    </span>
  );
}

function ActionsMenu({ record, onApprove, onReject }) {
  const canAct = record.status !== "approved";
  if (!canAct) return <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>—</span>;
  return (
    <div className="action__menu">
      {record.status !== "approved" && (
        <div className="action__item success" onClick={() => onApprove(record)}>
          Approve
        </div>
      )}
      {record.status !== "approved" && (
        <div className="action__item danger" onClick={() => onReject(record)}>
          Reject
        </div>
      )}
    </div>
  );
}

export default function AllKyc() {
  const router = useRouter();
  const qc = useQueryClient();

  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]     = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = useKycList({ page, status: statusFilter, search });
  const records = data?.body?.records || [];
  const total   = data?.body?.total || 0;

  const approveMut = useMutation({
    mutationFn: (kycId) => approveKyc(kycId),
    onSuccess: () => {
      message.success("KYC approved");
      qc.invalidateQueries({ queryKey: ['kyc'] });
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to approve"),
  });

  const rejectMut = useMutation({
    mutationFn: ({ kycId, reason }) => rejectKyc(kycId, reason),
    onSuccess: () => {
      message.success("KYC rejected");
      setRejectTarget(null);
      setRejectReason("");
      qc.invalidateQueries({ queryKey: ['kyc'] });
    },
    onError: (err) => message.error(err?.response?.data?.message || "Failed to reject"),
  });

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const columns = [
    {
      title: "Seller",
      dataIndex: "sellerId",
      render: (seller) => seller ? (
        <div>
          <div style={{ fontWeight: 600 }}>{seller.firstName} {seller.lastName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{seller.email}</div>
        </div>
      ) : "—",
    },
    {
      title: "Business Type",
      dataIndex: ["sellerId", "businessType"],
      render: (v) => v || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <StatusPill status={s} />,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      render: (d) => d ? new Date(d).toLocaleDateString() : "—",
    },
    {
      title: "Reviewed",
      dataIndex: "reviewedAt",
      render: (d) => d ? new Date(d).toLocaleDateString() : "—",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <ActionsMenu
              record={record}
              onApprove={(r) => approveMut.mutate(r.id)}
              onReject={(r) => { setRejectTarget(r); setRejectReason(""); }}
            />
          }
        >
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllKycWrapper>
      <div className="section__header">
        <p className="section__title">Seller KYC Applications</p>
        <p className="section__sub">Review and verify seller identity documents</p>
      </div>

      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={16} />
          <input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="filter__tabs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={statusFilter === f.value ? "active" : ""}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table__card">
        <Table
          dataSource={records}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onRow={(record) => ({
            onClick: () => router.push(`/kyc/${record.id}`),
          })}
        />
        {total > 10 && (
          <div className="pagination__row">
            <Pagination
              current={page}
              pageSize={10}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      <Modal
        title="Reject KYC Application"
        open={!!rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onOk={() => rejectMut.mutate({ kycId: rejectTarget.id, reason: rejectReason })}
        okText="Reject"
        okButtonProps={{ danger: true, loading: rejectMut.isPending }}
      >
        <p style={{ marginBottom: 12, color: "#6b7280", fontSize: "0.87rem" }}>
          Provide a reason for rejection. This will be emailed to the seller.
        </p>
        <Input.TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Government ID image is unclear, please resubmit"
        />
      </Modal>
    </AllKycWrapper>
  );
}

import { useState, useEffect } from "react";
import { Table, Pagination, Popover, Modal } from "antd";
import { AllReviewsWrapper } from "./all-reviews.styles";
import { getReviews, moderateReview, deleteReview } from "@/network/reviews";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { AiFillStar as StarIcon } from "react-icons/ai";
import useNotification from "@/hooks/useNotification";

const STATUS_FILTERS = [
  { label: "All",     value: "" },
  { label: "Active",  value: "active" },
  { label: "Flagged", value: "flagged" },
  { label: "Hidden",  value: "hidden" },
];

function StarRow({ rating = 0 }) {
  return (
    <div className="stars__row">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={13} color={i <= rating ? "#FCCB1B" : "#E0E0E0"} />
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const labels = { active: "Active", flagged: "Flagged", hidden: "Hidden" };
  return (
    <span className={`status__pill ${status}`}>
      <span className="pill__dot" />
      {labels[status] || status}
    </span>
  );
}

function ActionsMenu({ record, onModerate, onDelete, onClose }) {
  return (
    <div className="action__menu">
      {record.status !== "active" && (
        <button className="action__item success" onClick={() => { onModerate(record, "active"); onClose(); }}>
          Approve (make active)
        </button>
      )}
      {record.status !== "flagged" && (
        <button className="action__item warn" onClick={() => { onModerate(record, "flagged"); onClose(); }}>
          Flag for review
        </button>
      )}
      {record.status !== "hidden" && (
        <button className="action__item warn" onClick={() => { onModerate(record, "hidden"); onClose(); }}>
          Hide review
        </button>
      )}
      <button className="action__item danger" onClick={() => { onDelete(record); onClose(); }}>
        Delete permanently
      </button>
    </div>
  );
}

function useReviews({ status, page, limit }) {
  return useQuery({
    queryKey: ["admin-reviews", status, page, limit],
    queryFn: () => getReviews({ status, page, limit }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export default function AllReviews() {
  const qc = useQueryClient();
  const [success, error] = useNotification();
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useReviews({ status: statusFilter, page, limit: 20 });
  const allReviews = data?.body?.reviews || [];
  const total      = data?.body?.pagination?.total || 0;

  const filtered = debounced
    ? allReviews.filter((r) =>
        (r.reviewer || "").toLowerCase().includes(debounced.toLowerCase()) ||
        (r.product?.name || "").toLowerCase().includes(debounced.toLowerCase()) ||
        (r.review || "").toLowerCase().includes(debounced.toLowerCase())
      )
    : allReviews;

  const moderateMutation = useMutation({
    mutationFn: ({ id, status }) => moderateReview(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      success("Review status updated");
    },
    onError: () => error("Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      success("Review deleted");
    },
    onError: () => error("Failed to delete review"),
  });

  const handleModerate = (record, status) => {
    moderateMutation.mutate({ id: record.id, status });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Review",
      content: "This review will be permanently deleted and cannot be recovered. Continue?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(record.id),
    });
  };

  const columns = [
    {
      title: "Reviewer",
      key: "reviewer",
      width: 200,
      render: (_, r) => (
        <div>
          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
            {r.reviewer || "—"}
          </p>
          <p style={{ margin: 0, fontSize: "0.74rem", color: "#9ca3af" }}>
            {r.buyer?.email || r.reviewerEmail || ""}
          </p>
        </div>
      ),
    },
    {
      title: "Product",
      key: "product",
      width: 160,
      render: (_, r) => (
        <span style={{ fontSize: "0.82rem", color: "#374151" }}>
          {r.product?.name || "—"}
        </span>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 120,
      render: (_, r) => <StarRow rating={r.productRating} />,
    },
    {
      title: "Review",
      key: "review",
      width: 300,
      render: (_, r) => (
        <span className="review__snippet" title={r.review}>
          {r.review || <span style={{ color: "#d1d5db" }}>No text</span>}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (v) => <StatusPill status={v} />,
    },
    {
      title: "Date",
      dataIndex: "reviewDate",
      width: 130,
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          : "—",
    },
    {
      title: "",
      key: "actions",
      width: 52,
      render: (_, record) => (
        <Popover
          placement="bottomRight"
          open={openPopoverId === record.id}
          onOpenChange={(visible) => { if (!visible) setOpenPopoverId(null); }}
          content={
            <ActionsMenu
              record={record}
              onModerate={handleModerate}
              onDelete={handleDelete}
              onClose={() => setOpenPopoverId(null)}
            />
          }
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenPopoverId(openPopoverId === record.id ? null : record.id);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 6,
              color: "#9ca3af",
              padding: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllReviewsWrapper>
      <div className="section__header">
        <h2 className="section__title">Product Reviews</h2>
        <p className="section__sub">Moderate buyer reviews — approve, flag, hide, or delete</p>
      </div>

      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={15} />
          <input
            placeholder="Search by reviewer, product, or keyword…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

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
      </div>

      <div className="table__card">
        <Table
          rowKey={(r) => String(r.id)}
          dataSource={filtered}
          columns={columns}
          loading={isLoading}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: "No reviews found." }}
        />
        {total > 20 && (
          <div className="pagination__row">
            <Pagination
              current={page}
              pageSize={20}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
              size="small"
            />
          </div>
        )}
      </div>
    </AllReviewsWrapper>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Table, Popover, Switch, Select, Modal } from "antd";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { GoImage as ImgIcon } from "react-icons/go";
import { AllProductsWrapper } from "./all-products.styles";
import { useProducts } from "@/hooks/useProducts.jsx";
import { useToggleVisibility } from "@/hooks/useToggleVisibility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFxRate } from "@/hooks/useFxRate";
import { approveProduct } from "@/network/product";
import useNotification from "@/hooks/useNotification";

const DEFAULT_RATE = 1355;

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first"   },
  { value: "oldest",     label: "Oldest first"   },
  { value: "price_asc",  label: "Price: low–high" },
  { value: "price_desc", label: "Price: high–low" },
];

const STATUS_TABS = [
  { key: "",          label: "All"      },
  { key: "pending",   label: "Pending"  },
  { key: "approved",  label: "Approved" },
  { key: "rejected",  label: "Rejected" },
];

const STATUS_STYLES = {
  pending:  { bg: "#fef9c3", color: "#a16207", dot: "#f59e0b" },
  approved: { bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  rejected: { bg: "#fee2e2", color: "#dc2626", dot: "#dc2626" },
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#f1f5f9", color: "#6b7280", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: ".74rem", fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  );
}

const menuStyle = { display: "flex", flexDirection: "column", gap: 2, minWidth: 180, padding: 4 };
const menuItemBase = { width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 6, border: "none", background: "none", fontSize: ".83rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "background .1s" };

function MenuItem({ onClick, danger, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{ ...menuItemBase, color: danger ? "#dc2626" : "#111827", background: hovered ? (danger ? "#fef2f2" : "#f5f5f5") : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function ActionMenu({ product, onApprove, onReject }) {
  const router = useRouter();
  return (
    <div style={menuStyle}>
      <MenuItem onClick={() => router.push(`/product/${product._id}`)}>View Details</MenuItem>
      {product.productStatus === "pending" && (
        <>
          <MenuItem onClick={() => onApprove(product._id)}>Approve</MenuItem>
          <MenuItem danger onClick={() => onReject(product._id, product.productName)}>Reject</MenuItem>
        </>
      )}
    </div>
  );
}

export default function AllProductsScreen() {
  const [search,      setSearch]      = useState("");
  const [sort,        setSort]        = useState("newest");
  const [statusTab,   setStatusTab]   = useState("");
  const [filters,     setFilters]     = useState({ keyword: "", page: 1, limit: 10, sortBy: "newest" });
  const [products,    setProducts]    = useState([]);
  const [toggleLoading, setToggleLoading] = useState({});

  const { data, isLoading } = useProducts(filters);
  const { data: fxData } = useFxRate();
  const rate       = fxData?.body?.usdToNgnRate || DEFAULT_RATE;
  const pagination = data?.body?.pagination || {};
  const qc         = useQueryClient();
  const [success, error] = useNotification();

  useEffect(() => {
    if (data?.body?.products?.length) setProducts(data.body.products);
  }, [data]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((p) => ({ ...p, keyword: search, page: 1 }));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSort = (val) => {
    setSort(val);
    setFilters((p) => ({ ...p, sortBy: val, page: 1 }));
  };

  const handleStatusTab = (key) => {
    setStatusTab(key);
    setFilters((p) => ({ ...p, productStatus: key || undefined, page: 1 }));
  };

  const handleToggle = useToggleVisibility(setToggleLoading, setProducts);

  const { mutate: doApprove, isLoading: approving } = useMutation({
    mutationFn: (id) => approveProduct(id, "approve"),
    onSuccess: () => {
      success("Product approved and is now live.");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => error("Failed to approve product."),
  });

  const { mutate: doReject, isLoading: rejecting } = useMutation({
    mutationFn: (id) => approveProduct(id, "reject"),
    onSuccess: () => {
      success("Product rejected and removed.");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => error("Failed to reject product."),
  });

  const handleApprove = (id) => {
    Modal.confirm({
      title: "Approve this product?",
      content: "The product will go live on the marketplace and the seller will be notified.",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: () => doApprove(id),
    });
  };

  const handleReject = (id, name) => {
    Modal.confirm({
      title: "Reject this product?",
      content: `"${name}" will be permanently removed and the seller will be notified.`,
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => doReject(id),
    });
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, p) => (
        <div className="product__cell">
          {p.images?.[0]
            ? <img src={p.images[0]} alt="" className="product__thumb" />
            : <div className="product__thumb__placeholder"><ImgIcon size={16} /></div>
          }
          <span className="product__name">{p.productName}</span>
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brandArtist",
      key: "brand",
      render: (v) => v || <span style={{ color: "#9ca3af" }}>—</span>,
    },
    {
      title: "Seller",
      key: "seller",
      render: (_, p) => p.seller
        ? `${p.seller.firstName} ${p.seller.lastName}`
        : <span style={{ color: "#9ca3af" }}>—</span>,
    },
    {
      title: "Price",
      key: "price",
      render: (_, p) => {
        const regular = p.regularPrice;
        const sale    = p.salesPrice && p.salesPrice > 0 && p.salesPrice !== p.regularPrice ? p.salesPrice : null;
        const active  = sale ?? regular;
        if (active == null) return <span style={{ color: "#9ca3af" }}>—</span>;
        const usd = (active / rate).toFixed(2);
        return (
          <div style={{ lineHeight: 1.4 }}>
            {sale && (
              <div style={{ fontSize: ".72rem", color: "#9ca3af", textDecoration: "line-through" }}>
                ₦{Number(regular).toLocaleString()}
              </div>
            )}
            <div style={{ fontSize: ".84rem", fontWeight: 600, color: sale ? "#16a34a" : "#111827" }}>
              ₦{Number(active).toLocaleString()}
            </div>
            <div style={{ fontSize: ".72rem", color: "#6b7280" }}>~${usd}</div>
          </div>
        );
      },
    },
    {
      title: "Stock",
      dataIndex: "inStock",
      key: "stock",
      render: (v) => (
        <span className={`stock__pill ${v ? "in" : "out"}`}>
          {v ? "In stock" : "Out of stock"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "productStatus",
      key: "productStatus",
      render: (v) => <StatusPill status={v} />,
    },
    {
      title: "Visible",
      dataIndex: "isVisible",
      key: "visible",
      render: (v, p) => (
        <Switch
          checked={v}
          size="small"
          loading={!!toggleLoading[p._id]}
          onChange={(checked) => handleToggle(checked, p)}
        />
      ),
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, p) => (
        <Popover
          content={<ActionMenu product={p} onApprove={handleApprove} onReject={handleReject} />}
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
    <AllProductsWrapper>
      <div className="toolbar">
        <div className="search__box">
          <SearchIcon size={16} />
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {/* Status filter tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => handleStatusTab(t.key)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "1px solid",
                  fontSize: ".78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  borderColor: statusTab === t.key ? "var(--oosriPrimary)" : "#e2e8f0",
                  background: statusTab === t.key ? "var(--oosriPrimary)" : "#fff",
                  color: statusTab === t.key ? "#fff" : "#374151",
                  transition: "all .15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="sort__select">
            <label>Sort:</label>
            <Select
              value={sort}
              onChange={handleSort}
              options={SORT_OPTIONS}
              style={{ width: 160 }}
            />
          </div>
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={isLoading || approving || rejecting}
        pagination={{
          current: pagination.currentPage || filters.page,
          pageSize: filters.limit,
          total: pagination.total || 0,
          showSizeChanger: false,
          onChange: (page) => setFilters((p) => ({ ...p, page })),
        }}
        locale={{ emptyText: "No products found" }}
      />
    </AllProductsWrapper>
  );
}

import { Table, Avatar, Spin, Alert, Popover } from "antd";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { useRouter } from "next/router";
import { useTopPurchasedProducts } from "@/hooks/useAnalytics";

const TopPurchasedCategoriesTable = ({ period, category }) => {
  const { data, isLoading, error } = useTopPurchasedProducts(period, category);
  const router = useRouter();

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (name, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={40}
            src={row?.productImage?.[0]}
            shape="square"
            style={{ borderRadius: 6, background: "#f1f5f9", flexShrink: 0 }}
          />
          <span style={{ fontSize: ".84rem", fontWeight: 600, color: "#111827" }}>
            {name || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      render: (v) => (
        <span style={{ fontSize: ".78rem", color: "#6b7280", fontFamily: "monospace" }}>
          {v ? `${v.toString().slice(0, 8)}…` : "—"}
        </span>
      ),
    },
    {
      title: "Amount Sold",
      dataIndex: "totalAmountSold",
      key: "totalAmountSold",
      render: (v) => (
        <span style={{ fontSize: ".84rem", fontWeight: 600, color: "#111827" }}>
          ${(v || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Qty Sold",
      dataIndex: "totalQuantitySold",
      key: "totalQuantitySold",
      align: "center",
      render: (v) => (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, background: "#f1f5f9",
          borderRadius: 6, fontSize: ".82rem", fontWeight: 700, color: "#475569",
        }}>
          {v ?? 0}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, row) => (
        <Popover
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 140, padding: 4 }}>
              <button
                onClick={() => router.push(`/product/${row?.productId}`)}
                style={{
                  width: "100%", textAlign: "left", padding: "7px 10px",
                  borderRadius: 6, border: "none", background: "none",
                  fontSize: ".82rem", color: "#374151", cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                View Details
              </button>
            </div>
          }
          trigger="click"
          placement="bottomRight"
        >
          <EllipsisIcon size={18} style={{ cursor: "pointer", color: "#9ca3af" }} />
        </Popover>
      ),
    },
  ];

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <Spin />
    </div>
  );

  if (error) return (
    <Alert message="Failed to load products" type="error" showIcon style={{ margin: "16px 0" }} />
  );

  return (
    <Table
      columns={columns}
      dataSource={data?.body?.topProducts || []}
      rowKey={(r) => r._id || r.productId}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      locale={{ emptyText: "No products found for this period" }}
    />
  );
};

export default TopPurchasedCategoriesTable;

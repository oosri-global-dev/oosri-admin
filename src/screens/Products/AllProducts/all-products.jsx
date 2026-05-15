import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Table, Popover, Switch, Select } from "antd";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { GoImage as ImgIcon } from "react-icons/go";
import { AllProductsWrapper } from "./all-products.styles";
import { useProducts } from "@/hooks/useProducts";
import { useToggleVisibility } from "@/hooks/useToggleVisibility";
import { useQueryClient } from "@tanstack/react-query";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first"   },
  { value: "oldest",     label: "Oldest first"   },
  { value: "price_asc",  label: "Price: low–high" },
  { value: "price_desc", label: "Price: high–low" },
];

function ActionMenu({ product }) {
  const router = useRouter();
  return (
    <div className="action__menu">
      <button onClick={() => router.push(`/product/${product._id}`)}>View Details</button>
    </div>
  );
}

export default function AllProductsScreen() {
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("newest");
  const [filters,  setFilters]  = useState({ keyword: "", page: 1, limit: 10, sortBy: "newest" });
  const [products, setProducts] = useState([]);
  const [toggleLoading, setToggleLoading] = useState({});

  const { data, isLoading } = useProducts(filters);
  const pagination = data?.body?.pagination || {};

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

  const handleToggle = useToggleVisibility(setToggleLoading, setProducts);

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
      dataIndex: "regularPrice",
      key: "price",
      render: (v) => v != null ? `$${Number(v).toFixed(2)}` : "—",
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
        <Popover content={<ActionMenu product={p} />} trigger="click" placement="bottomRight">
          <EllipsisIcon size={18} style={{ cursor: "pointer", color: "#9ca3af" }} />
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

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={isLoading}
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

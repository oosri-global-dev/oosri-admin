import { useState, useEffect } from "react";
import { Table, Tabs, Popover } from "antd";
import { AllSellersWrapper } from "./all-sellers.styles";
import { useSellers } from "@/hooks/useSellers";
import { formatDate } from "@/utils/format-date";
import { useRouter } from "next/router";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";

function initials(first = "", last = "") {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";
}

function StatusPill({ verified }) {
  return verified
    ? <span className="pill verified"><span className="dot" />Verified</span>
    : <span className="pill unverified"><span className="dot" />Unverified</span>;
}

function ActionMenu({ seller }) {
  const router = useRouter();
  return (
    <div className="action__menu">
      <button onClick={() => router.push(`/seller/${seller.id}`)}>View Profile</button>
    </div>
  );
}

const TABS = [
  { key: "all",         label: "All Sellers"       },
  { key: "unverified",  label: "Unverified"        },
];

export default function AllSellers() {
  const router = useRouter();
  const [tab, setTab]       = useState("all");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const isUnverified = tab === "unverified";
  const { data, isLoading } = useSellers(debounced, isUnverified);

  const allSellers = data?.sellers || [];
  const sellers = isUnverified
    ? allSellers.filter((s) => !s.isVerified)
    : allSellers;

  const columns = [
    {
      title: "Seller",
      key: "seller",
      render: (_, s) => (
        <div className="seller__cell">
          <div className="avatar">{initials(s.firstName, s.lastName)}</div>
          <div>
            <p className="name">{s.firstName} {s.lastName}</p>
            <p className="email">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (v) => v || "—",
    },
    {
      title: "Joined",
      key: "joined",
      render: (_, s) => formatDate(s.createdAt) || "—",
    },
    {
      title: "Status",
      key: "status",
      render: (_, s) => <StatusPill verified={s.isVerified} />,
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, s) => (
        <Popover
          content={<ActionMenu seller={s} />}
          trigger="click"
          placement="bottomRight"
        >
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, color: '#9ca3af' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <AllSellersWrapper>
      <div className="screen__card">
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={TABS.map((t) => ({ key: t.key, label: t.label }))}
        />

        <div className="toolbar">
          <div className="search__box">
            <SearchIcon size={16} />
            <input
              placeholder="Search sellers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={sellers}
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No sellers found" }}
        />
      </div>
    </AllSellersWrapper>
  );
}

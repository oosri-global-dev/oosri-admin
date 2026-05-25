import { DashboardWrapper } from "./dashboard.styles";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";
import { useDashboardData } from "@/hooks/useDashboardData";
import OrdersTable from "@/components/screen-components/ordersTable";

import { GoStack as ProductsIcon } from "react-icons/go";
import { GoPeople as SellersIcon } from "react-icons/go";
import { BsPeople as BuyersIcon } from "react-icons/bs";
import { HiOutlineShoppingBag as OrdersIcon } from "react-icons/hi2";
import { TbCurrencyDollar as RevenueIcon } from "react-icons/tb";
import { MdOutlinePendingActions as PendingIcon } from "react-icons/md";
import { HiOutlineDocumentCheck as KycIcon } from "react-icons/hi2";
import { HiOutlineBanknotes as PayoutIcon } from "react-icons/hi2";
import { HiOutlineArrowUturnLeft as ReturnIcon } from "react-icons/hi2";

const PERIODS = ["Daily", "Weekly", "Monthly", "Yearly"];

const KPI_DEFS = [
  { key: "totalBuyers",       label: "Total Buyers",       icon: BuyersIcon,   color: "#3b82f6", bg: "#eff6ff" },
  { key: "totalSellers",      label: "Total Sellers",      icon: SellersIcon,  color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "totalOrders",       label: "Total Orders",       icon: OrdersIcon,   color: "#f59e0b", bg: "#fffbeb" },
  { key: "totalProductsSold", label: "Products Sold",      icon: ProductsIcon, color: "#10b981", bg: "#ecfdf5" },
  { key: "totalSales",        label: "Total Revenue",      icon: RevenueIcon,  color: "#fc5353", bg: "#fff1f2" },
];

// Pending action cards — each links to the relevant admin page
const PENDING_DEFS = [
  { key: "pendingProducts", label: "Pending Products", icon: PendingIcon, color: "#d97706", bg: "#fffbeb", href: "/products?status=pending" },
  { key: "pendingKyc",      label: "KYC Pending",      icon: KycIcon,     color: "#7c3aed", bg: "#f5f3ff", href: "/kyc"                     },
  { key: "pendingPayouts",  label: "Pending Payouts",  icon: PayoutIcon,  color: "#0891b2", bg: "#ecfeff", href: "/payouts"                  },
  { key: "openReturns",     label: "Open Returns",     icon: ReturnIcon,  color: "#ea580c", bg: "#fff7ed", href: "/returns"                  },
];

function formatValue(key, val) {
  if (val == null || val === "undefined") return "—";
  if (key === "totalSales") {
    const num = parseFloat(val);
    return isNaN(num) ? val : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }
  const num = parseInt(val, 10);
  return isNaN(num) ? val : num.toLocaleString("en-US");
}

export default function DashboardScreen() {
  const [period, setPeriod] = useState("Daily");

  const { data, isLoading } = useDashboardData(period.toLowerCase());

  const summary      = data?.overview?.data?.body?.dashboardSummary || {};
  const salesOverview = data?.summary?.data?.body?.dashboardSalesOverview || [];

  const { chartData, dateRange } = useMemo(() => {
    if (!salesOverview.length) return { chartData: {}, dateRange: "" };

    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const first = new Date(salesOverview[0].period);
    const last  = new Date(salesOverview[salesOverview.length - 1].period);

    const out = {};
    salesOverview.forEach((item) => {
      const d = new Date(item.period);
      let label;
      if (period === "Daily")        label = d.toLocaleDateString("en-US", { weekday: "short" });
      else if (period === "Weekly")  label = d.toLocaleDateString("en-US", { weekday: "short" });
      else if (period === "Monthly") label = d.toLocaleDateString("en-US", { month: "short" });
      else label = String(d.getFullYear());
      out[label] = item.totalSales;
    });

    return { chartData: out, dateRange: `${fmt(first)} — ${fmt(last)}` };
  }, [salesOverview, period]);

  return (
    <DashboardWrapper>

      {/* Overview KPI cards */}
      <div className="kpi__grid">
        {KPI_DEFS.map(({ key, label, icon: Icon, color, bg }) => (
          <div className="kpi__card" key={key}>
            <div className="kpi__icon" style={{ background: bg, color }}>
              <Icon size={20} />
            </div>
            <div className="kpi__body">
              <p className="kpi__label">{label}</p>
              <h2 className="kpi__value">
                {isLoading ? <span className="kpi__skeleton" /> : formatValue(key, summary[key])}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Pending action cards */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: "0 0 10px", fontSize: ".78rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em" }}>
          Needs Attention
        </p>
        <div className="kpi__grid">
          {PENDING_DEFS.map(({ key, label, icon: Icon, color, bg, href }) => {
            const count = summary[key] ?? 0;
            return (
              <Link href={href} key={key} style={{ textDecoration: "none" }}>
                <div
                  className="kpi__card"
                  style={{ cursor: "pointer", position: "relative", border: count > 0 ? `1.5px solid ${color}22` : undefined }}
                >
                  {count > 0 && (
                    <span style={{
                      position: "absolute", top: 10, right: 10,
                      background: color, color: "#fff",
                      fontSize: ".65rem", fontWeight: 700,
                      padding: "1px 6px", borderRadius: 20,
                    }}>
                      {count}
                    </span>
                  )}
                  <div className="kpi__icon" style={{ background: bg, color }}>
                    <Icon size={20} />
                  </div>
                  <div className="kpi__body">
                    <p className="kpi__label">{label}</p>
                    <h2 className="kpi__value" style={{ color: count > 0 ? color : undefined }}>
                      {isLoading ? <span className="kpi__skeleton" /> : count.toLocaleString("en-US")}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sales chart */}
      <div className="chart__card">
        <div className="chart__header">
          <div>
            <h3 className="chart__title">Sales Overview</h3>
            {dateRange && <p className="chart__range">{dateRange}</p>}
          </div>
          <div className="period__tabs">
            {PERIODS.map((p) => (
              <button
                key={p}
                className={`period__btn${period === p ? " active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="chart__body">
          <AreaChart
            data={chartData}
            empty={`No sales data for the ${period.toLowerCase()} period`}
            colors={["#fc5353"]}
            curve={true}
            legend={false}
          />
        </div>
      </div>

      {/* Recent orders */}
      <div className="table__card">
        <div className="table__header">
          <h3 className="table__title">Recent Sales</h3>
          <Link href="/order" className="see__all">See all</Link>
        </div>
        <div className="table__body">
          <OrdersTable />
        </div>
      </div>

    </DashboardWrapper>
  );
}

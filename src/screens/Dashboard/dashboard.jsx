import { DashboardWrapper } from "./dashboard.styles";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";
import { useDashboardSummary, useDashboardOverview } from "@/hooks/useDashboardData";
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
  { key: "platformRevenue",   label: "Platform Revenue",   icon: RevenueIcon,  color: "#fc5353", bg: "#fff1f2", custom: true },
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
  const num = parseInt(val, 10);
  return isNaN(num) ? val : num.toLocaleString("en-US");
}

function PlatformRevenueValue({ summary, isLoading, color }) {
  if (isLoading) return <span className="kpi__skeleton" />;
  const usd = parseFloat(summary.totalSalesUSD || 0);
  const ngn = parseFloat(summary.totalSalesNGN || 0);
  const fmtUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(usd);
  const fmtNGN = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ngn);
  if (!usd && !ngn) return <span>—</span>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {usd > 0 && <span style={{ fontSize: "1rem", fontWeight: 800, color }}>{fmtUSD}</span>}
      {ngn > 0 && <span style={{ fontSize: "1rem", fontWeight: 800, color }}>{fmtNGN}</span>}
    </div>
  );
}

const PERIOD_API_MAP = { Daily: "daily", Weekly: "weekly", Monthly: "monthly", Yearly: "annually" };

export default function DashboardScreen() {
  const [period, setPeriod] = useState("Daily");

  const { data: summaryRes, isLoading: summaryLoading } = useDashboardSummary();
  const { data: overviewRes, isLoading: overviewLoading } = useDashboardOverview(PERIOD_API_MAP[period] || "daily");

  const isLoading  = summaryLoading;
  const summary    = summaryRes?.data?.body?.dashboardSummary || {};
  const salesOverview = overviewRes?.data?.body?.dashboardSalesOverview || [];

  const { chartData, dateRange, totalOrders } = useMemo(() => {
    const validOverview = salesOverview.filter((item) => item.period != null);
    if (!validOverview.length) return { chartData: {}, dateRange: "", totalOrders: 0 };

    const parseLocalDate = (str) => {
      const parts = str.split("-");
      const year  = parseInt(parts[0], 10);
      const month = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
      const day   = parts[2] ? parseInt(parts[2], 10) : 1;
      return new Date(year, month, day);
    };

    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const first = parseLocalDate(validOverview[0].period);
    const last  = parseLocalDate(validOverview[validOverview.length - 1].period);

    const out = {};
    validOverview.forEach((item) => {
      const d = parseLocalDate(item.period);
      let label;
      if (period === "Daily")        label = d.toLocaleDateString("en-US", { weekday: "short" });
      else if (period === "Weekly")  label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      else if (period === "Yearly")  label = d.toLocaleDateString("en-US", { month: "short" });
      else                           label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      out[label] = item.orderCount || 0;
    });

    const totalOrders = validOverview.reduce((s, item) => s + (item.orderCount || 0), 0);

    return { chartData: out, dateRange: `${fmt(first)} — ${fmt(last)}`, totalOrders };
  }, [salesOverview, period]);

  return (
    <DashboardWrapper>

      {/* Overview KPI cards */}
      <div className="kpi__grid">
        {KPI_DEFS.map(({ key, label, icon: Icon, color, bg, custom }) => (
          <div className="kpi__card" key={key}>
            <div className="kpi__icon" style={{ background: bg, color }}>
              <Icon size={20} />
            </div>
            <div className="kpi__body">
              <p className="kpi__label">{label}</p>
              <h2 className="kpi__value">
                {custom
                  ? <PlatformRevenueValue summary={summary} isLoading={isLoading} color={color} />
                  : (isLoading ? <span className="kpi__skeleton" /> : formatValue(key, summary[key]))}
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
            <h3 className="chart__title">
              Orders Overview
              {totalOrders > 0 && (
                <span style={{ marginLeft: 8, fontSize: ".72rem", fontWeight: 600, color: "#9ca3af", letterSpacing: ".04em" }}>
                  {totalOrders.toLocaleString("en-US")} completed
                </span>
              )}
            </h3>
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
            empty={`No order data for the ${period.toLowerCase()} period`}
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

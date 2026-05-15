import { DashboardWrapper } from "./dashboard.styles";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";
import { useDashboardData } from "@/hooks/useDashboardData";
import { orderTableColumns } from "@/utils/order-helpers";
import OrdersTable from "@/components/screen-components/ordersTable";

import { GoStack as ProductsIcon } from "react-icons/go";
import { GoPeople as SellersIcon } from "react-icons/go";
import { BsPeople as BuyersIcon } from "react-icons/bs";
import { HiOutlineShoppingBag as OrdersIcon } from "react-icons/hi2";
import { TbCurrencyDollar as RevenueIcon } from "react-icons/tb";

const PERIODS = ["Daily", "Weekly", "Monthly", "Yearly"];

const KPI_DEFS = [
  { key: "totalBuyers",       label: "Total Buyers",       icon: BuyersIcon,   color: "#3b82f6", bg: "#eff6ff" },
  { key: "totalSellers",      label: "Total Sellers",      icon: SellersIcon,  color: "#8b5cf6", bg: "#f5f3ff" },
  { key: "totalOrders",       label: "Total Orders",       icon: OrdersIcon,   color: "#f59e0b", bg: "#fffbeb" },
  { key: "totalProductsSold", label: "Products Sold",      icon: ProductsIcon, color: "#10b981", bg: "#ecfdf5" },
  { key: "totalSales",        label: "Total Revenue",      icon: RevenueIcon,  color: "#fc5353", bg: "#fff1f2" },
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

  const summary = data?.overview?.data?.body?.dashboardSummary || {};
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
      if (period === "Daily")   label = d.toLocaleDateString("en-US", { weekday: "short" });
      else if (period === "Weekly")  label = d.toLocaleDateString("en-US", { weekday: "short" });
      else if (period === "Monthly") label = d.toLocaleDateString("en-US", { month: "short" });
      else label = String(d.getFullYear());
      out[label] = item.totalSales;
    });

    return { chartData: out, dateRange: `${fmt(first)} — ${fmt(last)}` };
  }, [salesOverview, period]);

  return (
    <DashboardWrapper>

        {/* KPI cards */}
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
            <OrdersTable dashboardTableColumns={orderTableColumns()} />
          </div>
        </div>

      </DashboardWrapper>
  );
}

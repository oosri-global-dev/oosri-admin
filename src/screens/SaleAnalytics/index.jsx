import { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { GoStack as StackIcon } from "react-icons/go";
import { IoBagOutline as BagIcon } from "react-icons/io5";
import { SaleAnalyticsWrapper } from "./index.styles";
import { useAnalyticsData } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/format-currency";
import useNotification from "@/hooks/useNotification";
import SalesChart from "./sales-chart";
import TopPurchasedCategoriesTable from "./top-purchased-category-table";
import ProductCategorySelect from "./product-category-select";

const YEAR_OPTIONS = [
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
];

const PERIOD_OPTIONS = [
  { value: "thisWeek",  label: "This Week"  },
  { value: "lastWeek",  label: "Last Week"  },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear",  label: "This Year"  },
  { value: "lastYear",  label: "Last Year"  },
];

export default function SaleAnalytics() {
  const [yearFilter,        setYearFilter]        = useState("thisYear");
  const [selectedCategory,  setSelectedCategory]  = useState("Sculpture");
  const [selectedPeriod,    setSelectedPeriod]    = useState("thisWeek");
  const [, error] = useNotification();

  const { data, isLoading, isError, error: fetchError } = useAnalyticsData(yearFilter);

  useEffect(() => {
    if (isError) error("Error loading sales data");
  }, [isError]);

  const analytics        = data?.salesAnalytics?.data?.body || {};
  const productAnalytics = data?.productAnalytics?.data?.body || {};

  const monthlyEarnings = analytics?.monthlyEarnings || {};
  const salesLabels = Object.keys(monthlyEarnings).map(
    (k) => k.charAt(0).toUpperCase() + k.slice(1)
  );
  const salesData = Object.values(monthlyEarnings);

  const mostPurchased  = productAnalytics?.mostPurchasedProduct  || {};
  const leastPurchased = productAnalytics?.leastPurchasedProduct || {};
  const topSeller      = productAnalytics?.topSeller             || {};

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <SaleAnalyticsWrapper>

      {/* KPI cards */}
      <div className="kpi__row">
        <div className="kpi__card">
          <div className="kpi__icon" style={{ background: "#fff1f2", color: "#fc5353" }}>
            <StackIcon size={22} />
          </div>
          <div>
            <p className="kpi__label">Total Sales</p>
            <h2 className="kpi__value">{formatCurrency(analytics?.totalEarnings) || "—"}</h2>
          </div>
        </div>
        <div className="kpi__card">
          <div className="kpi__icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
            <BagIcon size={22} />
          </div>
          <div>
            <p className="kpi__label">Total Orders</p>
            <h2 className="kpi__value">{analytics?.totalOrders ?? "—"}</h2>
          </div>
        </div>
      </div>

      {/* Sales chart */}
      <div className="chart__card">
        <div className="chart__header">
          <p className="chart__title">Monthly Earnings</p>
          <Select
            value={yearFilter}
            onChange={setYearFilter}
            options={YEAR_OPTIONS}
            style={{ width: 130 }}
          />
        </div>
        <div className="chart__body">
          <SalesChart labels={salesLabels} data={salesData} />
        </div>
      </div>

      {/* Product highlights */}
      <div className="section__card">
        <div className="section__header">
          <div>
            <p className="section__title">Product Highlights</p>
            <p className="section__sub">Most &amp; least purchased products and top seller</p>
          </div>
        </div>
        <div className="section__body">
          <div className="highlight__grid">

            <div className="highlight__item">
              <p className="hi__label">Most Purchased</p>
              <div className="hi__body">
                {mostPurchased?.productImage?.[0]
                  ? <img src={mostPurchased.productImage[0]} className="hi__img" alt="" />
                  : <div className="hi__placeholder" />
                }
                <div>
                  <p className="hi__name">{mostPurchased?.productName || "—"}</p>
                  <p className="hi__count">{mostPurchased?.quantitySold ?? 0} sold</p>
                </div>
              </div>
            </div>

            <div className="highlight__item">
              <p className="hi__label">Least Purchased</p>
              <div className="hi__body">
                {leastPurchased?.productImage?.[0]
                  ? <img src={leastPurchased.productImage[0]} className="hi__img" alt="" />
                  : <div className="hi__placeholder" />
                }
                <div>
                  <p className="hi__name">{leastPurchased?.productName || "—"}</p>
                  <p className="hi__count">{leastPurchased?.quantitySold ?? 0} sold</p>
                </div>
              </div>
            </div>

            <div className="highlight__item">
              <p className="hi__label">Top Seller</p>
              <div className="hi__body">
                {topSeller?.sellerImage
                  ? <img src={topSeller.sellerImage} className="hi__img" alt="" />
                  : <div className="hi__placeholder" />
                }
                <div>
                  <p className="hi__name">{topSeller?.sellerName || "—"}</p>
                  <p className="hi__count">{topSeller?.totalSold ?? 0} sold</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Product report */}
      <div className="section__card">
        <div className="section__header">
          <div>
            <p className="section__title">Product Report</p>
            <p className="section__sub">Sales breakdown by category and period</p>
          </div>
        </div>
        <div className="section__body">
          <div className="report__filters">
            <ProductCategorySelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              style={{ width: 220 }}
            />
            <div className="period__tabs">
              {PERIOD_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={selectedPeriod === value ? "active" : ""}
                  onClick={() => setSelectedPeriod(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <TopPurchasedCategoriesTable
            period={selectedPeriod}
            category={selectedCategory}
          />
        </div>
      </div>

    </SaleAnalyticsWrapper>
  );
}

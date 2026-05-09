import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { GoStack as StackIcon } from 'react-icons/go';
import { IoBagOutline as BagIcon } from 'react-icons/io5';
import { CiCreditCard1 as CardIcon } from 'react-icons/ci';
import { useDashboardData } from '@/hooks/useDashboardData';
import { OrderWrapper } from '../Order/orders.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import CustomLoader from '@/components/lib/CustomLoader';

import { SaleAnalyticsWrapper } from './index.styles';
import Button from '@/components/lib/Button';
import SalesChart from './sales-chart';
import Select from '@/components/lib/Select';
import { ProductReportData } from '@/utils/sale-analytics';
import { HiOutlineChartBar } from 'react-icons/hi2';
import CustomMultiSearchBar from '@/components/lib/MultiSearchBar';
import PurchasingChart from './purchasing-chart';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import TopSellingProduct from '@/assets/images/topSellingProduct.png';
import LeastSellingProduct from '@/assets/images/leastSellingProduct.png';

import {
  useAnalyticsData,
  useTopPurchasedProducts,
} from '@/hooks/useAnalytics';
import { formatCurrency } from '@/utils/format-currency';
import useNotification from '@/hooks/useNotification';

import TopPurchasedCategoriesTable from './top-purchased-category-table';
import ProductCategorySelect from './product-category-select';

export default function SaleAnalytics() {
  const [filters, setFilters] = useState([
    'Daily',
    'Weekly',
    'Monthly',
    'Yearly',
  ]);
  const [selectedFilter, setSelectedFilter] = useState('Monthly');

  const options = [
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
  ];
  const periods = [
    { value: 'thisWeek', label: 'This Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
  ];

  const [yearFilter, setYearFilter] = useState('thisYear');
  const [selectedCategory, setSelectedCategory] = useState('Sculpture');
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');

  const [productReport, setProductReport] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error: salesDataError,
  } = useAnalyticsData(yearFilter);

  const salesAnalyticsData = data?.salesAnalytics?.data?.body || {};
  const monthlyEarnings = salesAnalyticsData?.monthlyEarnings || {};
  const salesLabels = Object?.keys(monthlyEarnings).map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1)
  );

  const salesData = Object?.values(monthlyEarnings);
  const [error] = useNotification();

  useEffect(() => {
    if (isError && salesDataError) {
      error('Error loading sales data');
    }
  }, [isError, error]);

  const productAnalytics = data?.productAnalytics?.data?.body || {};

  const handleYearChange = (selectedOption) => {
    setYearFilter(selectedOption?.value);
  };

  const leastPurchased = productAnalytics?.leastPurchasedProduct || {};
  const mostPurchased = productAnalytics?.mostPurchasedProduct || {};
  const topSeller = productAnalytics?.topSeller || {};

  const salesBoxes = [
    {
      icon: <StackIcon size={22} color="#FB5183" />,
      value: `${formatCurrency(salesAnalyticsData?.totalEarnings)}`,
      label: 'Total Sales',
    },
    {
      icon: <BagIcon size={22} color="#FB5183" />,
      value: `${salesAnalyticsData?.totalOrders}`,
      label: 'Total Orders',
    },
  ];

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (

        <SaleAnalyticsWrapper>
          <FlexibleDiv className="summary__wrapper" justifyContent="start">
            {salesBoxes.map((sgn, idx) => (
              <FlexibleDiv className="single__summary__box" key={idx}>
                <div className="icon__wrapper">{sgn.icon}</div>
                <div className="summary__text">
                  <h1>{sgn.value}</h1>
                  <p className="label__text">{sgn.label}</p>
                </div>
              </FlexibleDiv>
            ))}
          </FlexibleDiv>
          {/* Filter Menus */}
          <FlexibleDiv
            justifyContent="end"
            margin="80px 0px 0px 0px"
            gap="15px"
          >
            {filters.map((sgn, idx) => (
              <Button
                backgroundColor={
                  selectedFilter === sgn ? 'var(--oosriPrimary)' : '#F5F5F5'
                }
                hoverBg="var(--oosriPrimary)"
                height="35px"
                radius="20px"
                key={idx}
                color={
                  selectedFilter === sgn ? 'var(--oosriWhite)' : '#757575'
                }
                onClick={() => setSelectedFilter(sgn)}
              >
                {sgn}
              </Button>
            ))}
          </FlexibleDiv>
          {/* Chart Section */}
          <FlexibleDiv width="100%" height="300px" className="graph__box">
            <SalesChart labels={salesLabels} data={salesData} />
          </FlexibleDiv>
          {/*Purchasing Reports */}
          <FlexibleDiv
            className="table__section"
            display="flex"
            flexDir="row"
            justifyContent="space-between"
            width="100%"
            marginBottom="10%"
          >
            <FlexibleDiv
              flexDir="row"
              width="100%"
              justifyContent="space-between"
              padding="0 30px"
              gap="12px"
              className="top__recent__box"
            >
              <div>
                <h1>Purchasing Report</h1>
                <p>Generate sales record from product </p>
              </div>
              <Select
                onChange={(value, option) => {
                  handleYearChange(option);
                }}
                options={options}
                value={yearFilter}
              />
            </FlexibleDiv>
            <FlexibleDiv
              display="flex"
              flexDir="row"
              justifyContent="space-between"
              width="100%"
            >
              <FlexibleDiv
                width="100%"
                display="flex"
                justifyContent="space-between"
                flexDir="row"
                padding="0 30px"
                alignItems="start"
                className="recent__sale__wrapper"
              >
                <FlexibleDiv
                  justifyContent="start"
                  flexDir="column"
                  alignItems="start"
                  width="50%"
                  className="item__box1 item__box"
                >
                  <h2>MOST PURCHASED</h2>
                  <FlexibleDiv
                    className="chart__box"
                    padding="50px 50px 80px 0px"
                    justifyContent="start"
                    flexWrap="noWrap"
                    gap="24px"
                    flexDir="row"
                  >
                    <FlexibleDiv
                      className="image__text"
                      justifyContent="column"
                      flexWrap="noWrap"
                      flexDir="row"
                    >
                      <img
                        className="product__image"
                        src={mostPurchased?.productImage[0]}
                      />
                      <FlexibleDiv
                        flexDir="column"
                        justifyContent="start"
                        alignItems="start"
                      >
                        <h5>{mostPurchased?.productName}</h5>
                        <p className="percent__increase">
                          {mostPurchased?.quantitySold} sold
                        </p>
                      </FlexibleDiv>
                    </FlexibleDiv>
                    {/* Chart */}
                    {/* <FlexibleDiv width="50%">
                        <PurchasingChart increasing={true} />
                        <FlexibleDiv
                          flexWrap="noWrap"
                          margin="6px 0px"
                          gap="2px"
                        >
                          <span className="percent__increase">
                            {' '}
                            <FaArrowUp />{' '}
                          </span>
                          <p className="percent__increase">2.8%</p>
                          <p className="neutral">from last week</p>
                        </FlexibleDiv>
                      </FlexibleDiv> */}
                  </FlexibleDiv>
                </FlexibleDiv>
                {/*  */}
                <FlexibleDiv
                  justifyContent="start"
                  flexDir="row"
                  alignItems="start"
                  width="fit-content"
                  className="item__box2 item__box"
                >
                  <h2>LEAST PURCHASED</h2>
                  <FlexibleDiv
                    className="chart__box"
                    padding="50px 50px 80px 0px"
                    flexWrap="noWrap"
                  >
                    <FlexibleDiv
                      flexDir="row"
                      flexWrap="noWrap"
                      justifyContent="start"
                      className="image__text"
                    >
                      <img
                        className="product__image"
                        src={leastPurchased?.productImage[0]}
                      />
                      <FlexibleDiv
                        flexDir="column"
                        justifyContent="start"
                        alignItems="start"
                      >
                        <h5>{leastPurchased?.productName}</h5>
                        <p className="percent__increase">
                          {leastPurchased?.quantitySold} sold
                        </p>
                      </FlexibleDiv>
                    </FlexibleDiv>
                    {/* Chart */}
                    {/* <FlexibleDiv width="50%">
                        <PurchasingChart />
                        <FlexibleDiv
                          flexWrap="noWrap"
                          margin="6px 0px"
                          gap="2px"
                        >
                          <span className="percent__decrease">
                            {' '}
                            <FaArrowDown />{' '}
                          </span>
                          <p className="percent__decrease">2.8%</p>
                          <p className="neutral">from last week</p>
                        </FlexibleDiv>
                      </FlexibleDiv> */}
                  </FlexibleDiv>
                </FlexibleDiv>
              </FlexibleDiv>
            </FlexibleDiv>
          </FlexibleDiv>
          <FlexibleDiv
            width="100%"
            display="flex"
            justifyContent="space-between"
            flexDir="row"
            padding="0 30px"
            alignItems="start"
            className="recent__sale__wrapper"
          >
            <FlexibleDiv
              justifyContent="start"
              flexDir="column"
              alignItems="start"
              width="fit-content"
              className="item__box1 item__box"
            >
              <h2>TOP SELLER</h2>
              <FlexibleDiv
                className="chart__box"
                padding="50px 50px 80px 0px"
                justifyContent="start"
                flexWrap="noWrap"
                gap="24px"
                flexDir="row"
              >
                <FlexibleDiv
                  className="image__text"
                  justifyContent="column"
                  flexWrap="noWrap"
                  flexDir="row"
                >
                  <img
                    className="product__image"
                    src={topSeller?.sellerImage}
                  />
                  <FlexibleDiv
                    flexDir="column"
                    justifyContent="start"
                    alignItems="start"
                  >
                    <h5>{topSeller?.sellerName}</h5>
                    <p className="percent__increase">
                      {topSeller?.totalSold} sold
                    </p>
                  </FlexibleDiv>
                </FlexibleDiv>
                {/* Chart */}
              </FlexibleDiv>
            </FlexibleDiv>
          </FlexibleDiv>
          {/* Product Reports */}
          <div className="product__report">
            <h1>Product Report</h1>
            <p>Generate sales record from product </p>
          </div>
          <FlexibleDiv
            className="table__section"
            justifyContent="space-around"
          >
            <FlexibleDiv
              width="100%"
              display="flex"
              flexDir="row"
              justifyContent="space-between"
              padding="0 30px"
              className="top__recent__box multi__select__box"
            >
              <FlexibleDiv className="multi__select" width="35%">
                {/* ujherjhhhhhhhhhhhhhhhhhhhhhru */}
                <ProductCategorySelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  allowClear={true}
                />
              </FlexibleDiv>
              <FlexibleDiv
                gap="15px"
                justifyContent="end"
                className="btn__group"
                width="65%"
              >
                {periods.map((sgn, idx) => (
                  <Button
                    backgroundColor={
                      selectedPeriod === sgn.value
                        ? 'var(--oosriPrimary)'
                        : '#F5F5F5'
                    }
                    hoverBg="var(--oosriPrimary)"
                    height="35px"
                    radius="20px"
                    key={idx}
                    color={
                      selectedPeriod === sgn.value
                        ? 'var(--oosriWhite)'
                        : '#757575'
                    }
                    onClick={() => setSelectedPeriod(sgn.value)}
                  >
                    {sgn.label}
                  </Button>
                ))}
              </FlexibleDiv>
            </FlexibleDiv>
            {/* Table Section */}
            <TopPurchasedCategoriesTable
              period={selectedPeriod}
              category={selectedCategory}
            />
          </FlexibleDiv>
        </SaleAnalyticsWrapper>
      )}
    </>
  );
}

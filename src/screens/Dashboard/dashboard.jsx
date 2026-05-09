import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { DashboardWrapper } from './dashboard.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import { useEffect, useState } from 'react';
import 'chartkick/chart.js';
import { AreaChart } from 'react-chartkick';
import { Table } from 'antd';
import {
  dashboardTableColumns,
  dashboardTableData,
} from '@/utils/dashboard-helpers';
import OrdersTable from '@/components/screen-components/ordersTable';
import Link from 'next/link';
import CustomLoader from '@/components/lib/CustomLoader';
import { GoStack as StackIcon } from 'react-icons/go';
import { IoBagOutline as BagIcon } from 'react-icons/io5';
import { CiCreditCard1 as CardIcon } from 'react-icons/ci';
import { orderTableColumns } from '@/utils/order-helpers';
import { useDashboardData } from '@/hooks/useDashboardData';
import { OrderWrapper } from '../Order/orders.styles';

export default function DashboardScreen() {
  const [filters] = useState(['Daily', 'Weekly', 'Monthly', 'Yearly']);
  const [selectedFilter, setSelectedFilter] = useState('Daily');

  const { data, isLoading, error } = useDashboardData(
    selectedFilter?.toLowerCase()
  );
  const dashboardSummary = data?.overview?.data?.body?.dashboardSummary || {};
  const dashboardSalesOverview =
    data?.summary?.data?.body?.dashboardSalesOverview || [];

  let graphOptions = {};
  let startDate = '';
  let endDate = '';

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;

  if (dashboardSalesOverview?.length) {
    const first = new Date(dashboardSalesOverview[0]?.period);
    const last = new Date(
      dashboardSalesOverview[dashboardSalesOverview?.length - 1]?.period
    );

    startDate = formatDate(first);
    endDate = formatDate(last);
    // setStartDate(
    //   `${first.getDate('YYYY-MM-DD')}/${first.getUTCMonth(
    //     'YYYY-MM-DD'
    //   )}/${first?.getFullYear()}`
    // );
    // setEndDate(
    //   `${last.getDate('YYYY-MM-DD')}/${last.getUTCMonth(
    //     'YYYY-MM-DD'
    //   )}/${last?.getFullYear()}`
    // );
    for (let index = 0; index < data.data.data.length; index++) {
      const date = new Date(dashboardSalesOverview[index]?.period);
      if (selectedFilter === 'Daily') {
        const options = { weekday: 'short' };
        const dayOfWeek = date?.toLocaleDateString('en-US', options);
        graphOptions[dayOfWeek] = dashboardSalesOverview[index].totalSales;
      } else if (selectedFilter === 'Weekly') {
        // const getWeekNumber = (d) => {
        //   const dateCopy = new Date(d.getTime());
        //   dateCopy.setHours(0, 0, 0, 0);
        //   dateCopy.setDate(dateCopy.getDate() + 3 - (dateCopy.getDay() + 6) % 7);
        //   const week1 = new Date(dateCopy.getFullYear(), 0, 4);
        //   const diff = dateCopy - week1;
        //   const oneDay = 1000 * 60 * 60 * 24;
        //   const weekNumber = Math.ceil(diff / oneDay / 7);
        //   return weekNumber;
        // };

        // const weekNumber = getWeekNumber(date);
        // console.log(weekNumber)
        // graphOptions[`Week ${weekNumber}`]=data.data.data[index].totalSales
        const options = { weekday: 'short' };
        const dayOfWeek = date.toLocaleDateString('en-US', options);
        graphOptions[dayOfWeek] = dashboardSalesOverview[index].totalSales;
      } else if (selectedFilter === 'Monthly') {
        const options = { month: 'short' };
        const dayOfWeek = date.toLocaleDateString('en-US', options);
        graphOptions[dayOfWeek] = dashboardSalesOverview[index].totalSales;
      } else if (selectedFilter === 'Yearly') {
        const dayOfWeek = date.getFullYear();
        graphOptions[dayOfWeek] = dashboardSalesOverview[index].totalSales;
      }
    }
  }

  const summaryBoxes = [
    {
      icon: <StackIcon size={22} color="#FB5183" />,
      value: `${dashboardSummary?.totalBuyers}`,
      label: 'Total Buyers',
    },
    {
      icon: <CardIcon size={22} color="#FB5183" />,
      value: `${dashboardSummary?.totalSellers}`,
      label: 'Total Seller',
    },
    {
      icon: <BagIcon size={22} color="#FB5183" />,
      value: `${dashboardSummary?.totalOrders}`,
      label: 'Total Order',
    },
    {
      icon: <BagIcon size={22} color="#FB5183" />,
      value: `${dashboardSummary?.totalProductsSold}`,
      label: 'Total Products Sold',
    },
    {
      icon: <BagIcon size={22} color="#FB5183" />,
      value: `${dashboardSummary?.totalSales}`,
      label: 'Total Sales',
    },
  ];

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <DashboardWrapper>
          <FlexibleDiv className="summary__wrapper">
            {summaryBoxes.map((sgn, idx) => (
              <FlexibleDiv className="single__summary__box" key={idx}>
                <div className="icon__wrapper">{sgn.icon}</div>
                <div className="summary__text">
                  <h1>{sgn.value}</h1>
                  <p className="label__text">{sgn.label}</p>
                </div>
              </FlexibleDiv>
            ))}
          </FlexibleDiv>
          <FlexibleDiv
            flexDir="column"
            className="graph__section"
            flexWrap="nowrap"
            gap="40px"
          >
            <FlexibleDiv
              flexDir="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="nowrap"
              className="graph__info__wrapper"
            >
              <FlexibleDiv
                width="fit-content"
                flexDir="column"
                alignItems="flex-start"
                className="graph__info"
              >
                <h4>Sales Overview</h4>
                <p>
                  {startDate} - {endDate}
                </p>
              </FlexibleDiv>
              <FlexibleDiv
                flexDir="row"
                flexWrap="nowrap"
                width="fit-content"
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
            </FlexibleDiv>
            <FlexibleDiv width="100%" className="graph__box">
              <AreaChart
                data={graphOptions}
                empty={`No sales data for ${selectedFilter?.toLowerCase()} period`}
              />
            </FlexibleDiv>
          </FlexibleDiv>

          <FlexibleDiv className="table__section" justifyContent="space-around">
            <FlexibleDiv
              flexDir="row"
              width="100%"
              justifyContent="space-between"
              padding="0 30px"
              className="top__recent__box"
            >
              <p className="recent__text">RECENT SALE</p>
              <Link className="see__all__text" href={'/order'}>
                See All
              </Link>
            </FlexibleDiv>
            <FlexibleDiv className="recent__sale__wrapper">
              {/* <OrderWrapper> */}
              <OrdersTable dashboardTableColumns={orderTableColumns()} />
              {/* </OrderWrapper> */}
            </FlexibleDiv>
          </FlexibleDiv>
        </DashboardWrapper>
      )}
    </>
  );
}

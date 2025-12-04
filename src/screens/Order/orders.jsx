'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout/dashboard-layout';
import { OrderWrapper } from './orders.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import CustomMultiSearchBar from '@/components/lib/MultiSearchBar';
import Select from '@/components/lib/Select';
import { Table } from 'antd';
import { orderTableColumns } from '@/utils/order-helpers';
import { useOrders } from '@/hooks/useOrders';

export default function OrderScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const filters = {
    skip: 0,
    limit: 10,
    // customerName: '',
    // sellerName: '',
    // orderStatus: '',
  };

  const { data, isLoading, isError, error } = useOrders(
    filters,
    debouncedSearchTerm
  );
  const totalPages = data?.body?.totalPages;
  const currentPage = data?.body?.currentPage;

  console.log('ORDERS', data);

  const options = [{ value: 'This Year', label: 'This Year' }];

  return (
    <OrderWrapper>
      <FlexibleDiv className="flex justify-between mb-4"></FlexibleDiv>
      <FlexibleDiv className="top__section" justifyContent="space-between">
        <CustomMultiSearchBar
          width="max-content"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder="Search by product name"
        />
        <Select options={options} defaultValue="This Year" />
      </FlexibleDiv>

      <Table
        className="table__class"
        rowSelection={{
          type: 'checkbox',
        }}
        loading={isLoading}
        dataSource={data?.body?.orders || []}
        columns={orderTableColumns}
        pagination={{
          current: currentPage || 1,
          pageSize: filters.limit,
          total: totalPages || 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${totalPages} items`,
          // onChange: handlePageChange,
        }}
      />
    </OrderWrapper>
  );
}

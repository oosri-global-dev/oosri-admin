import { useState } from 'react';
import { FlexibleDiv } from '../lib/Box/styles';
import { OrderWrapper } from './orders.styles';
import { useOrders } from '@/hooks/useOrders';
import { Table } from 'antd';

export default function OrdersTable({ dashboardTableColumns }) {
  const { data, isLoading, error } = useOrders({
    skip: 0,
    limit: 10,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionType] = useState('checkbox');

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data?.data?.body, 'data from orders hook');

  return (
    <FlexibleDiv>
      <OrderWrapper>
        <Table
          className="table__class"
          columns={dashboardTableColumns}
          dataSource={data?.body.orders || []}
          rowSelection={Object.assign({ type: selectionType }, rowSelection)}
          loading={isLoading}
          rowKey={(rowSelection) => rowSelection._id}
        />
      </OrderWrapper>
    </FlexibleDiv>
  );
}

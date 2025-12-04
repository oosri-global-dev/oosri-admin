import React from 'react';
import {
  Table,
  Typography,
  Spin,
  Alert,
  Space,
  Avatar,
  Popover,
  Button,
} from 'antd';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';

import { useTopPurchasedProducts } from '@/hooks/useAnalytics';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import { useRouter } from 'next/router';

const { Title } = Typography;

const TopPurchasedCategoriesTable = ({ period, category }) => {
  const { data, isLoading, error } = useTopPurchasedProducts(period, category);
  const router = useRouter();
  const columns = [
    {
      title: (
        <FlexibleDiv justifyContent="start" padding="0 0 0 40px">
          Product Name
        </FlexibleDiv>
      ),
      dataIndex: 'productName',
      key: 'productName',
      render: (_, obj) => (
        <Space>
          <Avatar size={45} src={obj?.productImage?.[0]} />
          <Space direction="vertical" size={1}>
            <p>{_}</p>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Total Amount Sold',
      dataIndex: 'totalAmountSold',
      key: 'totalAmountSold',
      render: (_) => <p>${_?.toFixed(2)}</p>,
    },
    {
      title: 'Total Quantity Sold',
      dataIndex: 'totalQuantitySold',
      key: 'totalQuantitySold',
      align: 'center',
      render: (_) => <p>{_}</p>,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, obj) => (
        <Popover
          content={
            <div className="popover__custom">
              <Button
                height="30px"
                radius="5px"
                onClick={() => {
                  router.push(`/product/${obj && obj?.productId}`);
                }}
              >
                View More Details
              </Button>
            </div>
          }
          trigger="click"
        >
          <EllipsisIcon style={{ cursor: 'pointer' }} />
        </Popover>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;

  if (error)
    return (
      <Alert
        message="Error"
        description={error.message || 'Failed to fetch data'}
        type="error"
        showIcon
      />
    );

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <Table
        columns={columns}
        dataSource={data?.body?.topProducts || []}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default TopPurchasedCategoriesTable;

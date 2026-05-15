import { Table, Avatar, Spin } from 'antd';
import { useOrders } from '@/hooks/useOrders';
import { useRouter } from 'next/router';

const STATUS_COLORS = {
  delivered:       { bg: '#dcfce7', color: '#16a34a' },
  processing:      { bg: '#fef9c3', color: '#a16207' },
  pending:         { bg: '#fff7ed', color: '#c2410c' },
  'sent for pickup': { bg: '#eff6ff', color: '#1d4ed8' },
  canceled:        { bg: '#fee2e2', color: '#dc2626' },
};

function StatusPill({ status }) {
  const s = status?.toLowerCase() || '';
  const { bg = '#f1f5f9', color = '#475569' } = STATUS_COLORS[s] || {};
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: '.75rem', fontWeight: 600, background: bg, color,
    }}>
      {status || '—'}
    </span>
  );
}

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
    render: (v, row) => (
      <div>
        <p style={{ fontSize: '.83rem', fontWeight: 600, color: '#111827', margin: 0 }}>{v}</p>
        <p style={{ fontSize: '.75rem', color: '#9ca3af', margin: 0 }}>{row.itemNum} item{row.itemNum !== 1 ? 's' : ''}</p>
      </div>
    ),
  },
  {
    title: 'Customer',
    dataIndex: 'customerFullName',
    key: 'customer',
    render: (v) => <span style={{ fontSize: '.83rem', color: '#374151' }}>{v || '—'}</span>,
  },
  {
    title: 'Date',
    dataIndex: 'orderDate',
    key: 'date',
    render: (v) => <span style={{ fontSize: '.82rem', color: '#6b7280' }}>{v || '—'}</span>,
  },
  {
    title: 'Amount',
    dataIndex: 'totalAmount',
    key: 'amount',
    render: (_, row) => (
      <span style={{ fontSize: '.83rem', fontWeight: 600, color: '#111827' }}>
        {row.formattedAmountNGN || '—'}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'orderStatus',
    key: 'status',
    render: (v) => <StatusPill status={v} />,
  },
];

export default function OrdersTable() {
  const router = useRouter();
  const { data, isLoading, error } = useOrders({ skip: 0, limit: 8 });

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <Spin />
    </div>
  );

  if (error) return (
    <p style={{ padding: '24px', color: '#dc2626', fontSize: '.84rem' }}>
      Failed to load recent orders
    </p>
  );

  return (
    <Table
      columns={columns}
      dataSource={data?.body?.orders || []}
      rowKey="_id"
      pagination={false}
      loading={isLoading}
      onRow={(row) => ({ onClick: () => router.push(`/order/${row.orderId || row._id}`) })}
      rowClassName={() => 'clickable__row'}
      locale={{ emptyText: 'No recent orders' }}
    />
  );
}

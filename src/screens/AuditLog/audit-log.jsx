import { useState } from 'react';
import { Table, Select, DatePicker } from 'antd';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

const ACTION_COLORS = {
  DELETE_SELLER:             { bg: '#fee2e2', color: '#dc2626' },
  SUSPEND_SELLER:            { bg: '#fff7ed', color: '#c2410c' },
  UNSUSPEND_SELLER:          { bg: '#f0fdf4', color: '#16a34a' },
  APPROVE_PRODUCT:           { bg: '#dcfce7', color: '#15803d' },
  APPROVE_PAYOUT:            { bg: '#dcfce7', color: '#15803d' },
  DELETE_PRODUCT:            { bg: '#fee2e2', color: '#dc2626' },
  TOGGLE_PRODUCT_VISIBILITY: { bg: '#eff6ff', color: '#1d4ed8' },
  UPDATE_PRODUCT:            { bg: '#f5f3ff', color: '#7c3aed' },
  UPDATE_ORDER_STATUS:       { bg: '#fffbeb', color: '#b45309' },
  REJECT_PAYOUT:             { bg: '#fee2e2', color: '#dc2626' },
  APPROVE_KYC:               { bg: '#dcfce7', color: '#15803d' },
  REJECT_KYC:                { bg: '#fee2e2', color: '#dc2626' },
  APPROVE_RETURN:            { bg: '#eff6ff', color: '#1d4ed8' },
  REJECT_RETURN:             { bg: '#fee2e2', color: '#dc2626' },
  TRIGGER_REFUND:            { bg: '#f5f3ff', color: '#7c3aed' },
  CLOSE_RETURN:              { bg: '#f9fafb', color: '#6b7280' },
  SUSPEND_BUYER:             { bg: '#fff7ed', color: '#c2410c' },
  UNSUSPEND_BUYER:           { bg: '#f0fdf4', color: '#16a34a' },
};

function ActionBadge({ action }) {
  const s = ACTION_COLORS[action] || { bg: '#f1f5f9', color: '#475569' };
  const label = action?.replace(/_/g, ' ') || '—';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function StatusDot({ status }) {
  const ok = status === 'success';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '.78rem', fontWeight: 600, color: ok ? '#16a34a' : '#dc2626' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: ok ? '#16a34a' : '#dc2626' }} />
      {ok ? 'Success' : 'Failed'}
    </span>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  .filters__bar {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    padding: 16px 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .table__card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }

  .search__box {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 12px;
    background: #f8fafc;
    width: 200px;
    font-size: .83rem;

    input {
      border: none; outline: none; background: transparent;
      font-size: .83rem; color: #111827; width: 100%;
      &::placeholder { color: #9ca3af; }
    }
    svg { color: #9ca3af; flex-shrink: 0; }
  }

  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-size: .75rem; font-weight: 600; color: #6b7280;
    text-transform: uppercase; letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .ant-table-tbody > tr > td {
    font-size: .83rem; color: #374151;
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 11px 16px;
  }
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }

  .ant-select .ant-select-selector {
    border-color: #e2e8f0 !important;
    border-radius: 8px !important;
    font-size: .83rem;
  }
  .ant-picker {
    border-color: #e2e8f0 !important;
    border-radius: 8px !important;
    font-size: .83rem;
  }
`;

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'DELETE_SELLER',             label: 'Delete Seller' },
  { value: 'SUSPEND_SELLER',            label: 'Suspend Seller' },
  { value: 'UNSUSPEND_SELLER',          label: 'Unsuspend Seller' },
  { value: 'APPROVE_PRODUCT',           label: 'Approve Product' },
  { value: 'DELETE_PRODUCT',            label: 'Delete Product' },
  { value: 'UPDATE_PRODUCT',            label: 'Update Product' },
  { value: 'TOGGLE_PRODUCT_VISIBILITY', label: 'Toggle Visibility' },
  { value: 'UPDATE_ORDER_STATUS',       label: 'Update Order Status' },
  { value: 'APPROVE_PAYOUT',            label: 'Approve Payout' },
  { value: 'REJECT_PAYOUT',             label: 'Reject Payout' },
  { value: 'APPROVE_KYC',              label: 'Approve KYC' },
  { value: 'REJECT_KYC',               label: 'Reject KYC' },
  { value: 'APPROVE_RETURN',            label: 'Approve Return' },
  { value: 'REJECT_RETURN',             label: 'Reject Return' },
  { value: 'TRIGGER_REFUND',            label: 'Trigger Refund' },
  { value: 'SUSPEND_BUYER',             label: 'Suspend Buyer' },
  { value: 'UNSUSPEND_BUYER',           label: 'Unsuspend Buyer' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failed' },
];

export default function AuditLogScreen() {
  const [page, setPage]           = useState(1);
  const [action, setAction]       = useState('');
  const [status, setStatus]       = useState('');
  const [dateRange, setDateRange] = useState(null);

  const params = {
    page,
    limit: 20,
    ...(action     ? { action }              : {}),
    ...(status     ? { status }              : {}),
    ...(dateRange?.[0] ? { from: dateRange[0].toISOString() } : {}),
    ...(dateRange?.[1] ? { to:   dateRange[1].toISOString() } : {}),
  };

  const { data, isLoading } = useAuditLogs(params);
  const logs       = data?.body?.logs || [];
  const pagination = data?.body?.pagination || {};

  const handleFilterChange = (setter) => (val) => { setter(val); setPage(1); };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v) => v ? new Date(v).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—',
    },
    {
      title: 'Admin',
      dataIndex: 'adminEmail',
      key: 'adminEmail',
      render: (v) => <span style={{ fontSize: '.82rem', color: '#374151' }}>{v || '—'}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (v) => <ActionBadge action={v} />,
    },
    {
      title: 'Entity',
      key: 'entity',
      render: (_, row) => (
        <span style={{ fontSize: '.78rem', color: '#6b7280' }}>
          {row.entity || '—'}
          {row.entityId && <span style={{ marginLeft: 4, fontFamily: 'monospace', fontSize: '.72rem', color: '#9ca3af' }}>{String(row.entityId).slice(-8)}</span>}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v) => <StatusDot status={v} />,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (v) => <span style={{ fontSize: '.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>{v || '—'}</span>,
    },
  ];

  return (
    <Wrapper>
      <div className="filters__bar">
        <Select
          value={action}
          onChange={handleFilterChange(setAction)}
          options={ACTION_OPTIONS}
          style={{ width: 180 }}
          size="middle"
        />
        <Select
          value={status}
          onChange={handleFilterChange(setStatus)}
          options={STATUS_OPTIONS}
          style={{ width: 140 }}
          size="middle"
        />
        <RangePicker
          onChange={(dates) => { setDateRange(dates); setPage(1); }}
          size="middle"
          style={{ fontSize: '.83rem' }}
        />
      </div>

      <div className="table__card">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={logs}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 20,
            total: pagination.total || 0,
            showSizeChanger: false,
            showTotal: (total) => `${total} log entries`,
            onChange: (p) => setPage(p),
          }}
          locale={{ emptyText: 'No audit log entries found.' }}
        />
      </div>
    </Wrapper>
  );
}

import { Select, Spin, message, Avatar } from 'antd';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import styled from 'styled-components';

const STATUS_OPTIONS = [
  { value: 'pending',           label: 'Pending'           },
  { value: 'processing',        label: 'Processing'        },
  { value: 'pending_logistics', label: 'Pending Logistics' },
  { value: 'completed',         label: 'Completed'         },
  { value: 'on-hold',           label: 'On Hold'           },
  { value: 'canceled',          label: 'Canceled'          },
];

const STATUS_COLORS = {
  completed:  { bg: '#dcfce7', color: '#16a34a' },
  processing: { bg: '#fef9c3', color: '#a16207' },
  pending:    { bg: '#fff7ed', color: '#c2410c' },
  'on-hold':  { bg: '#eff6ff', color: '#1d4ed8' },
  canceled:   { bg: '#fee2e2', color: '#dc2626' },
};

function StatusPill({ status }) {
  const s = (status || '').toLowerCase();
  const { bg = '#f1f5f9', color = '#475569' } = STATUS_COLORS[s] || {};
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: bg, color, fontSize: '.75rem', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {status || '—'}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '.8rem', color: '#6b7280', fontWeight: 500, flexShrink: 0, marginRight: 16 }}>{label}</span>
      <span style={{ fontSize: '.84rem', color: '#111827', fontWeight: 500, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

function Card({ title, children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', ...style }}>
      {title && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.85rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</p>
        </div>
      )}
      <div style={{ padding: '8px 20px 16px' }}>{children}</div>
    </div>
  );
}

export default function OrderDetails({ data, isLoading }) {
  const orderId = data?.orderId;
  const { mutate: changeStatus, isLoading: isUpdating } = useUpdateOrderStatus(orderId);

  const handleStatusChange = (newStatus) => {
    changeStatus(newStatus, {
      onSuccess: () => message.success(`Status updated to "${newStatus}"`),
      onError:   (err) => message.error(err?.response?.data?.message || 'Failed to update status'),
    });
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>;
  }

  if (!data) {
    return <div style={{ padding: 40, color: '#dc2626', textAlign: 'center' }}>Order not found.</div>;
  }

  const products = data?.products || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Avatar
          src={data?.customerProfileImage}
          size={56}
          style={{ background: '#f1f5f9', color: '#475569', fontSize: '1.2rem', flexShrink: 0 }}
        >
          {(data?.customerFullName || '?')[0]}
        </Avatar>
        <div style={{ flex: 1, minWidth: 160 }}>
          <h2 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>{data?.customerFullName || '—'}</h2>
          <p style={{ margin: 0, fontSize: '.82rem', color: '#6b7280', fontFamily: 'monospace' }}>Order #{data?.orderId}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusPill status={data?.orderStatus} />
          <Select
            value={data?.orderStatus}
            onChange={handleStatusChange}
            loading={isUpdating}
            disabled={isUpdating}
            options={STATUS_OPTIONS}
            style={{ width: 150 }}
            size="small"
          />
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Left: items + delivery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Order items */}
          <Card title={`Items (${products.length})`}>
            {products.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: '.84rem', margin: '8px 0' }}>No items</p>
              : products.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < products.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <img
                    src={item?.productImage?.[0]}
                    alt=""
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', background: '#f1f5f9', flexShrink: 0 }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '.9rem', color: '#111827' }}>{item?.productName || '—'}</p>
                    <p style={{ margin: '0 0 2px', fontSize: '.8rem', color: '#6b7280' }}>ID: {item?.productId}</p>
                    <p style={{ margin: 0, fontSize: '.84rem', fontWeight: 600, color: '#fc5353' }}>
                      {data?.currencyCode === 'USD'
                        ? (item?.formattedProductAmountUSD || '—')
                        : (item?.formattedProductAmountNGN || item?.productAmount || '—')}
                    </p>
                  </div>
                </div>
              ))
            }
          </Card>

          {/* Delivery info */}
          <Card title="Delivery Information">
            <InfoRow label="Delivery Address" value={data?.deliveryAddress} />
            <InfoRow label="Phone"            value={data?.phoneNumber} />
            <InfoRow label="Order Date"       value={data?.orderDate} />
            <InfoRow label="Payment Status"   value={data?.paymentStatus} />
          </Card>
        </div>

        {/* Right: order summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card title="Order Summary">
            <InfoRow
              label="Subtotal"
              value={data?.currencyCode === 'USD' ? data?.formattedAmountUSD : data?.formattedAmountNGN}
            />
            <InfoRow
              label="Delivery Fee"
              value={data?.formattedDeliveryFeeNGN || (data?.currencyCode === 'USD' ? '$0.00' : '₦0.00')}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 4 }}>
              <span style={{ fontSize: '.88rem', fontWeight: 700, color: '#111827' }}>Total</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fc5353' }}>
                {data?.currencyCode === 'USD'
                  ? (data?.formattedAmountUSD || '—')
                  : (data?.formattedAmountNGN || '—')}
              </span>
            </div>
          </Card>

          <Card title="Seller">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
              <Avatar
                src={products[0]?.productImage?.[0]}
                size={40}
                shape="square"
                style={{ borderRadius: 8, background: '#f1f5f9', flexShrink: 0 }}
              />
              <span style={{ fontSize: '.84rem', fontWeight: 600, color: '#111827' }}>
                {data?.sellerFullName || '—'}
              </span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

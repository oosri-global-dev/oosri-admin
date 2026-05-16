import { Spin } from 'antd';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { MdClose, MdDoneAll } from 'react-icons/md';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_CONFIG = {
  new_order:      { color: '#2563eb', bg: '#eff6ff', label: 'Order' },
  new_seller:     { color: '#16a34a', bg: '#f0fdf4', label: 'Seller' },
  new_buyer:      { color: '#7c3aed', bg: '#f5f3ff', label: 'Buyer' },
  payout_request: { color: '#d97706', bg: '#fffbeb', label: 'Payout' },
  product_review: { color: '#0891b2', bg: '#ecfeff', label: 'Product' },
  system:         { color: '#6b7280', bg: '#f9fafb', label: 'System' },
};

function NotificationItem({ notification, onRead, onDelete }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const ago = timeAgo(notification.createdAt);

  return (
    <div
      onClick={() => !notification.isRead && onRead(notification.id)}
      style={{
        display: 'flex', gap: 12, padding: '12px 16px',
        background: notification.isRead ? '#fff' : '#f8faff',
        borderBottom: '1px solid #f1f5f9',
        cursor: notification.isRead ? 'default' : 'pointer',
        transition: 'background .15s',
        alignItems: 'flex-start',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
        background: notification.isRead ? 'transparent' : cfg.color,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontSize: '.68rem', fontWeight: 700, padding: '1px 7px',
            borderRadius: 10, background: cfg.bg, color: cfg.color,
          }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: '.72rem', color: '#9ca3af', marginLeft: 'auto' }}>{ago}</span>
        </div>
        <p style={{ margin: '0 0 2px', fontSize: '.82rem', fontWeight: notification.isRead ? 400 : 600, color: '#111827', lineHeight: 1.4 }}>
          {notification.title}
        </p>
        <p style={{ margin: 0, fontSize: '.78rem', color: '#6b7280', lineHeight: 1.4 }}>
          {notification.message}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db',
          padding: 2, borderRadius: 4, display: 'flex', alignItems: 'center', flexShrink: 0,
        }}
        title="Dismiss"
      >
        <MdClose size={14} />
      </button>
    </div>
  );
}

export default function NotificationPanel({ notifications, unreadCount, isLoading, onRead, onMarkAllRead, onDelete }) {
  return (
    <div style={{ width: 360, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.12)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <HiOutlineBellAlert size={16} color="#374151" />
        <span style={{ marginLeft: 8, fontSize: '.88rem', fontWeight: 700, color: '#111827', flex: 1 }}>
          Notifications
          {unreadCount > 0 && (
            <span style={{ marginLeft: 8, background: '#2563eb', color: '#fff', fontSize: '.68rem', fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>
              {unreadCount}
            </span>
          )}
        </span>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            title="Mark all as read"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#2563eb', fontSize: '.75rem', fontWeight: 600, padding: '4px 6px', borderRadius: 6 }}
          >
            <MdDoneAll size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ maxHeight: 440, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <HiOutlineBellAlert size={36} color="#d1d5db" />
            <p style={{ margin: '12px 0 0', fontSize: '.84rem', color: '#9ca3af' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={onRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '10px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: '.75rem', color: '#9ca3af' }}>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

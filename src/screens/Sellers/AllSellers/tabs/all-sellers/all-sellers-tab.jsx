import { Table, Avatar, Popover, Modal } from 'antd';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { formatDate } from '@/utils/format-date';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeller, suspendSeller, unsuspendSeller } from '@/network/sellers';
import useNotification from '@/hooks/useNotification';

function StatusPill({ seller }) {
  if (seller.isSuspended) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#fee2e2', color: '#dc2626' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} />Suspended
      </span>
    );
  }
  return seller.isVerified
    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#f0fdf4', color: '#16a34a' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />Verified</span>
    : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, background: '#fff7ed', color: '#b45309' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />Unverified</span>;
}

function ActionMenu({ seller, router, onDelete, onSuspend, onUnsuspend }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 180, padding: 4 }}>
      <button
        onClick={() => router.push(`/seller/${seller.id}`)}
        style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', fontSize: '.82rem', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        View Seller Details
      </button>
      {seller.isSuspended
        ? (
          <button
            onClick={() => onUnsuspend(seller.id)}
            style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', fontSize: '.82rem', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            Unsuspend
          </button>
        ) : (
          <button
            onClick={() => onSuspend(seller.id)}
            style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', fontSize: '.82rem', color: '#d97706', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            Suspend Seller
          </button>
        )
      }
      <button
        onClick={() => onDelete(seller.id, `${seller.firstName} ${seller.lastName}`)}
        style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', fontSize: '.82rem', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        Delete Seller
      </button>
    </div>
  );
}

export default function AllSellersTab({ sellers, loading }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [success, error] = useNotification();

  const { mutate: doDelete } = useMutation({
    mutationFn: (id) => deleteSeller(id),
    onSuccess: () => { success('Seller deleted.'); qc.invalidateQueries({ queryKey: ['sellers'] }); },
    onError:   () => error('Failed to delete seller.'),
  });

  const { mutate: doSuspend } = useMutation({
    mutationFn: (id) => suspendSeller(id, 'Suspended by admin'),
    onSuccess: () => { success('Seller suspended.'); qc.invalidateQueries({ queryKey: ['sellers'] }); },
    onError:   () => error('Failed to suspend seller.'),
  });

  const { mutate: doUnsuspend } = useMutation({
    mutationFn: (id) => unsuspendSeller(id),
    onSuccess: () => { success('Seller unsuspended.'); qc.invalidateQueries({ queryKey: ['sellers'] }); },
    onError:   () => error('Failed to unsuspend seller.'),
  });

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: 'Delete this seller?',
      content: `"${name}" and all their products will be permanently removed. This cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => doDelete(id),
    });
  };

  const handleSuspend = (id) => {
    Modal.confirm({
      title: 'Suspend this seller?',
      content: 'The seller will lose access to their account. Their listings will remain but will not be purchasable.',
      okText: 'Suspend',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => doSuspend(id),
    });
  };

  const columns = [
    {
      title: 'Seller',
      key: 'seller',
      render: (_, obj) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar src={obj.profilePicture} size={38} style={{ background: '#f1f5f9', color: '#475569', fontSize: '.72rem', fontWeight: 700, flexShrink: 0 }}>
            {(obj.firstName || '?')[0]}
          </Avatar>
          <div>
            <p style={{ fontSize: '.85rem', fontWeight: 600, color: '#111827', margin: 0 }}>{obj.firstName} {obj.lastName}</p>
            <p style={{ fontSize: '.78rem', color: '#6b7280', margin: 0 }}>{obj.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (v) => v || <span style={{ color: '#9ca3af' }}>—</span>,
    },
    {
      title: 'Joined',
      key: 'joined',
      render: (_, obj) => formatDate(obj.createdAt) || '—',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, obj) => <StatusPill seller={obj} />,
    },
    {
      title: '',
      key: 'action',
      width: 48,
      render: (_, obj) => (
        <Popover
          content={
            <ActionMenu
              seller={obj}
              router={router}
              onDelete={handleDelete}
              onSuspend={handleSuspend}
              onUnsuspend={(id) => doUnsuspend(id)}
            />
          }
          trigger="click"
          placement="bottomRight"
        >
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, color: '#9ca3af' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <EllipsisIcon size={18} />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sellers}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      locale={{ emptyText: 'No sellers found' }}
    />
  );
}

import { Table, Avatar, Popover } from 'antd';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { formatDate } from '@/utils/format-date';
import { useRouter } from 'next/router';

function ActionMenu({ seller, router }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 160, padding: 4 }}>
      <button
        onClick={() => router.push(`/seller/${seller.id}`)}
        style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', fontSize: '.82rem', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        View Seller Details
      </button>
    </div>
  );
}

export default function UnVerifiedSellersTab({ sellers, loading }) {
  const router = useRouter();

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
      title: '',
      key: 'action',
      width: 48,
      render: (_, obj) => (
        <Popover content={<ActionMenu seller={obj} router={router} />} trigger="click" placement="bottomRight">
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
      locale={{ emptyText: 'No unverified sellers found' }}
    />
  );
}

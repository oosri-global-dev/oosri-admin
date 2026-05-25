import { Tabs, Avatar, Tag, Spin, Modal, Table } from 'antd';
import { useSeller } from '@/hooks/useSeller';
import { useProducts } from '@/hooks/useProducts';
import { formatDate, formatISODateWithOrdinal } from '@/utils/format-date';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeller, suspendSeller, unsuspendSeller } from '@/network/sellers';
import { useRouter } from 'next/router';
import useNotification from '@/hooks/useNotification';
import Link from 'next/link';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '.8rem', color: '#6b7280', fontWeight: 500, flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: '.84rem', color: '#111827', fontWeight: 500, textAlign: 'right', wordBreak: 'break-word', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
      {title && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</p>
        </div>
      )}
      <div style={{ padding: '4px 20px 16px' }}>{children}</div>
    </div>
  );
}

function DocImage({ label, src }) {
  if (!src) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontSize: '.78rem', color: '#6b7280', fontWeight: 600, marginBottom: 8 }}>{label}</p>
      <img src={src} alt={label} style={{ maxWidth: 320, width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', objectFit: 'cover' }} />
    </div>
  );
}

function PersonalTab({ d, personal }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20, alignItems: 'start' }}>
      <div>
        <Card title="Personal Information">
          <InfoRow label="Full Name"     value={`${personal.firstName || ''} ${personal.lastName || ''}`.trim()} />
          <InfoRow label="Email"         value={personal.email} />
          <InfoRow label="Phone"         value={personal.phoneNumber} />
          <InfoRow label="Country"       value={personal.country} />
          <InfoRow label="Address"       value={personal.residentialAddress} />
          <InfoRow label="Date of Birth" value={formatISODateWithOrdinal(personal.dob)} />
          <InfoRow label="Joined"        value={personal.joinDate ? formatDate(personal.joinDate) : null} />
        </Card>
        {personal.countryIdCard && (
          <Card title="Government ID">
            <DocImage label="ID Card" src={personal.countryIdCard} />
          </Card>
        )}
      </div>
      <div>
        <Card title="Status">
          <div style={{ padding: '12px 0 4px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700,
              background: personal.isVerified ? '#dcfce7' : '#fef9c3',
              color: personal.isVerified ? '#16a34a' : '#a16207',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: personal.isVerified ? '#16a34a' : '#a16207' }} />
              {personal.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </Card>
        {personal.profilePicture && (
          <Card title="Photo">
            <img src={personal.profilePicture} alt="" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', aspectRatio: '1', border: '1px solid #e2e8f0', marginTop: 4 }} />
          </Card>
        )}
      </div>
    </div>
  );
}

function BusinessTab({ business }) {
  const acct = business.accountData || {};
  return (
    <div>
      <Card title="Business Information">
        <InfoRow label="Business Name"    value={business.businessName} />
        <InfoRow label="Business Type"    value={business.businessType} />
        <InfoRow label="Reg. Number"      value={acct.companyRegNum} />
        <InfoRow label="Business Address" value={acct.companyAddress} />
        {acct.companyDescription && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '.8rem', color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>Description</p>
            <p style={{ fontSize: '.84rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{acct.companyDescription}</p>
          </div>
        )}
      </Card>
      <Card title="Documents">
        <DocImage label="Business Certificate" src={acct.companyCertificate} />
        <DocImage label="Government ID"        src={business.profileImage} />
      </Card>
    </div>
  );
}

function BankTab({ bank }) {
  if (!bank || Object.keys(bank).length === 0) {
    return <p style={{ color: '#9ca3af', fontSize: '.84rem', padding: 4 }}>No bank details on file.</p>;
  }
  return (
    <Card title="Bank Details">
      <InfoRow label="Account Name"   value={bank.accountName} />
      <InfoRow label="Bank"           value={bank.bank} />
      <InfoRow label="Account Number" value={bank.accountNumber} />
    </Card>
  );
}

const APPROVAL_STYLES = {
  pending:  { bg: '#fef9c3', color: '#a16207' },
  approved: { bg: '#dcfce7', color: '#16a34a' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

function ProductsTab({ sellerId }) {
  const { data, isLoading } = useProducts({ sellerId, limit: 20, page: 1 });
  const products = data?.body?.products || data?.data?.body?.products || [];

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {p.images?.[0] && (
            <img src={p.images[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '.84rem', fontWeight: 600, color: '#111827' }}>{p.productName || '—'}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      key: 'category',
      render: (_, p) => <span style={{ fontSize: '.78rem', color: '#6b7280' }}>{p.category || '—'}</span>,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, p) => (
        <span style={{ fontSize: '.84rem', fontWeight: 600, color: '#111827' }}>
          {p.regularPrice != null ? `₦${Number(p.regularPrice).toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, p) => {
        const s = APPROVAL_STYLES[p.productStatus] || APPROVAL_STYLES.pending;
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, background: s.bg, color: s.color }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
            {p.productStatus ? p.productStatus.charAt(0).toUpperCase() + p.productStatus.slice(1) : 'Pending'}
          </span>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, p) => (
        <Link href={`/product/${p.id}`} style={{ fontSize: '.78rem', color: 'var(--oosriPrimary)', fontWeight: 600, textDecoration: 'none' }}>
          View
        </Link>
      ),
    },
  ];

  if (isLoading) return <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><Spin /></div>;

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={products}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      locale={{ emptyText: 'No products listed by this seller.' }}
    />
  );
}

export default function Seller({ sellerId }) {
  const { data, isLoading, refetch } = useSeller(sellerId);
  const d   = data?.data?.body || {};
  const qc  = useQueryClient();
  const router = useRouter();
  const [success, error] = useNotification();

  const { mutate: doDelete, isLoading: deleting } = useMutation({
    mutationFn: () => deleteSeller(sellerId),
    onSuccess: () => {
      success('Seller deleted.');
      qc.invalidateQueries({ queryKey: ['sellers'] });
      router.push('/sellers');
    },
    onError: () => error('Failed to delete seller.'),
  });

  const { mutate: doSuspend, isLoading: suspending } = useMutation({
    mutationFn: () => suspendSeller(sellerId, 'Suspended by admin'),
    onSuccess: () => { success('Seller suspended.'); refetch(); qc.invalidateQueries({ queryKey: ['sellers'] }); },
    onError:   () => error('Failed to suspend seller.'),
  });

  const { mutate: doUnsuspend, isLoading: unsuspending } = useMutation({
    mutationFn: () => unsuspendSeller(sellerId),
    onSuccess: () => { success('Seller unsuspended.'); refetch(); qc.invalidateQueries({ queryKey: ['sellers'] }); },
    onError:   () => error('Failed to unsuspend seller.'),
  });

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete this seller?',
      content: 'All their products will be permanently removed. This cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => doDelete(),
    });
  };

  const handleSuspend = () => {
    Modal.confirm({
      title: 'Suspend this seller?',
      content: 'The seller will lose access to their account.',
      okText: 'Suspend',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => doSuspend(),
    });
  };

  const personal = {
    firstName: d.firstName, lastName: d.lastName, email: d.email,
    country: d.country, phoneNumber: d.phoneNumber,
    joinDate: d.createdAt, dob: d.personalBusinessAccount?.dateOfBirth,
    isVerified: d.isVerified, profilePicture: d.profilePicture,
    residentialAddress: d.personalBusinessAccount?.residentialAddress,
    countryIdCard: d.personalBusinessAccount?.countryIdentificationCard,
  };

  const business = {
    businessType: d.businessType,
    businessName: d.businessType === 'Corporate'
      ? d.corporateBusinessAccount?.companyName
      : `${d.firstName || ''} ${d.lastName || ''}`.trim(),
    accountData: d.businessType === 'Corporate'
      ? d.corporateBusinessAccount
      : d.personalBusinessAccount,
    profileImage: d.profilePicture,
  };

  const bank = d.bankDetails || {};

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin size="large" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Profile header */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Avatar src={d.profilePicture} size={60} style={{ background: '#f1f5f9', color: '#475569', fontSize: '1.3rem', flexShrink: 0 }}>
          {(d.firstName || '?')[0]}
        </Avatar>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
            {`${d.firstName || ''} ${d.lastName || ''}`.trim() || '—'}
          </h2>
          <p style={{ margin: 0, fontSize: '.82rem', color: '#6b7280' }}>{d.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {d.isSuspended && (
            <Tag color="error" style={{ fontSize: '.78rem', fontWeight: 600 }}>Suspended</Tag>
          )}
          <Tag color={d.isVerified ? 'success' : 'warning'} style={{ fontSize: '.78rem', fontWeight: 600 }}>
            {d.isVerified ? 'Verified Seller' : 'Unverified'}
          </Tag>
          {d.isSuspended
            ? (
              <button
                onClick={() => doUnsuspend()}
                disabled={unsuspending || deleting}
                style={{ height: 32, padding: '0 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 7, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: unsuspending ? 0.6 : 1 }}
              >
                {unsuspending ? 'Unsuspending…' : 'Unsuspend'}
              </button>
            ) : (
              <button
                onClick={handleSuspend}
                disabled={suspending || deleting}
                style={{ height: 32, padding: '0 14px', background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', borderRadius: 7, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: suspending ? 0.6 : 1 }}
              >
                {suspending ? 'Suspending…' : 'Suspend'}
              </button>
            )
          }
          <button
            onClick={handleDelete}
            disabled={deleting || suspending || unsuspending}
            style={{ height: 32, padding: '0 14px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 7, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.6 : 1 }}
          >
            {deleting ? 'Deleting…' : 'Delete Seller'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="personal"
        items={[
          { key: 'personal', label: 'Personal Details',  children: <PersonalTab  d={d} personal={personal} /> },
          { key: 'business', label: 'Business Details',  children: <BusinessTab  business={business} /> },
          { key: 'bank',     label: 'Bank Details',      children: <BankTab      bank={bank} /> },
          { key: 'products', label: 'Products',          children: <ProductsTab  sellerId={sellerId} /> },
        ]}
        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px 20px 20px' }}
      />
    </div>
  );
}

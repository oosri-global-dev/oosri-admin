import { useState } from 'react';
import { Tag } from 'antd';
import { useFxRate } from '@/hooks/useFxRate';

const DEFAULT_RATE = 1355;

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '.79rem', color: '#6b7280', fontWeight: 500, flexShrink: 0, marginRight: 12, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: '.84rem', color: '#111827', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function Card({ title, children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', ...style }}>
      {title && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</p>
        </div>
      )}
      <div style={{ padding: '4px 20px 16px' }}>{children}</div>
    </div>
  );
}

function StockBadge({ inStock }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700,
      background: inStock ? '#dcfce7' : '#fee2e2',
      color: inStock ? '#16a34a' : '#dc2626',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: inStock ? '#16a34a' : '#dc2626' }} />
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  );
}

function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const valid = images.filter(Boolean);
  if (!valid.length) return (
    <div style={{ width: '100%', aspectRatio: '1', background: '#f1f5f9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#9ca3af', fontSize: '.84rem' }}>No image</span>
    </div>
  );
  return (
    <div>
      <img src={valid[active]} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }} />
      {valid.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {valid.map((src, i) => (
            <img key={i} src={src} alt="" onClick={() => setActive(i)}
              style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, border: `2px solid ${i === active ? '#fc5353' : '#e2e8f0'}`, cursor: 'pointer' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CATEGORY_FIELDS = {
  Sculpture:         [['Weight', 'weight'], ['Width', 'width'], ['Height', 'height'], ['Technique', 'technique']],
  'Textiles/Fabrics':[['Weight', 'weight'], ['Yard', 'yard'], ['Pattern', 'pattern'], ['Fabric Type', 'fabricType']],
  Pottery:           [['Diameter', 'diameter'], ['Clay Type', 'clayType'], ['Height', 'height'], ['Glaze', 'glaze']],
  Paintings:         [['Medium', 'medium'], ['Condition', 'condition'], ['Size', 'size']],
  Jewelry:           [['Length', 'length'], ['Diameter', 'diameter'], ['Stone Type', 'stoneType'], ['Metal Type', 'metalType']],
};

function PriceRow({ label, ngnValue, rate, highlight }) {
  if (ngnValue == null || ngnValue === 0) return null;
  const usd = (ngnValue / rate).toFixed(2);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '.79rem', color: '#6b7280', fontWeight: 500 }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '.84rem', fontWeight: 600, color: highlight ? '#16a34a' : '#111827' }}>
          ₦{Number(ngnValue).toLocaleString()}
        </div>
        <div style={{ fontSize: '.72rem', color: '#6b7280' }}>~${usd}</div>
      </div>
    </div>
  );
}

const APPROVAL_STYLES = {
  pending:  { bg: '#fef9c3', color: '#a16207', dot: '#f59e0b', label: 'Pending Review' },
  approved: { bg: '#dcfce7', color: '#16a34a', dot: '#16a34a', label: 'Approved'       },
  rejected: { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626', label: 'Rejected'       },
};

function ApprovalBadge({ status }) {
  const s = APPROVAL_STYLES[status] || APPROVAL_STYLES.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 20, fontSize: '.76rem', fontWeight: 700,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function ProductDetailsView({ data, onEdit, onApprove, onReject, approving, rejecting }) {
  const { data: fxData } = useFxRate();
  const rate = fxData?.body?.usdToNgnRate || DEFAULT_RATE;

  if (!data) return null;

  const catFields = CATEGORY_FIELDS[data.category] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{data.productName || '—'}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <StockBadge inStock={data.inStock} />
            <ApprovalBadge status={data.productStatus} />
            {data.category && <Tag color="blue" style={{ margin: 0 }}>{data.category}</Tag>}
            {data.subCategory && <Tag style={{ margin: 0 }}>{data.subCategory}</Tag>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.productStatus === 'pending' && (
            <>
              <button
                onClick={onApprove}
                disabled={approving || rejecting}
                style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: (approving || rejecting) ? 0.6 : 1 }}
              >
                {approving ? 'Approving…' : 'Approve'}
              </button>
              <button
                onClick={onReject}
                disabled={approving || rejecting}
                style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: (approving || rejecting) ? 0.6 : 1 }}
              >
                {rejecting ? 'Rejecting…' : 'Reject'}
              </button>
            </>
          )}
          <button
            onClick={onEdit}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', background: 'var(--oosriPrimary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Edit Product
          </button>
        </div>
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left: images */}
        <ImageGallery images={data.images} />

        {/* Right: info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Card title="Pricing">
            <div style={{ paddingTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, padding: '4px 0 6px', borderBottom: '1px solid #e2e8f0', marginBottom: 2 }}>
                <span style={{ fontSize: '.72rem', color: '#9ca3af', fontWeight: 600, letterSpacing: '.04em' }}>NGN</span>
                <span style={{ fontSize: '.72rem', color: '#9ca3af', fontWeight: 600, letterSpacing: '.04em', minWidth: 56, textAlign: 'right' }}>USD (est.)</span>
              </div>
              <PriceRow label="Regular Price"  ngnValue={data.regularPrice}  rate={rate} />
              <PriceRow label="Sales Price"    ngnValue={data.salesPrice && data.salesPrice !== data.regularPrice ? data.salesPrice : null} rate={rate} highlight />
              <PriceRow label="Discount Price" ngnValue={data.discountPrice} rate={rate} highlight />
              {data.previousPrice && data.previousPrice !== data.regularPrice &&
                <PriceRow label="Previous Price" ngnValue={data.previousPrice} rate={rate} />
              }
              {data.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '.79rem', color: '#6b7280', fontWeight: 500 }}>Discount</span>
                  <span style={{ fontSize: '.84rem', fontWeight: 600, color: '#f59e0b' }}>{data.discount}%</span>
                </div>
              )}
              <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '.72rem', color: '#9ca3af' }}>Rate used: $1 = ₦{Number(rate).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card title="Product Details">
            <InfoRow label="Brand / Artist"  value={data.brandArtist} />
            <InfoRow label="Product Type"    value={data.productType} />
            <InfoRow label="Category"        value={data.category} />
            <InfoRow label="Subcategory"     value={data.subCategory} />
          </Card>

          {catFields.length > 0 && (
            <Card title={`${data.category} Attributes`}>
              {catFields.map(([label, key]) => <InfoRow key={key} label={label} value={data[key]} />)}
            </Card>
          )}

          {data.productDescription && (
            <Card title="Description">
              <div
                style={{ fontSize: '.84rem', color: '#374151', lineHeight: 1.65, paddingTop: 8 }}
                dangerouslySetInnerHTML={{ __html: data.productDescription }}
              />
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Input, InputNumber, Select } from 'antd';
import { IoArrowBackOutline as BackIcon } from 'react-icons/io5';
import { editProduct } from '@/network/product';
import useNotification from '@/hooks/useNotification';

const { TextArea } = Input;

const labelStyle = {
  fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block',
};
const inputStyle = {
  width: '100%', borderRadius: 8, fontSize: '.84rem', height: 38,
};
const cardStyle = {
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16,
};
const cardHeaderStyle = {
  padding: '12px 20px', borderBottom: '1px solid #f1f5f9',
};
const cardTitleStyle = {
  margin: 0, fontSize: '.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em',
};
const cardBodyStyle = {
  padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14,
};

function SectionCard({ title, children }) {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <p style={cardTitleStyle}>{title}</p>
      </div>
      <div style={cardBodyStyle}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <p style={{ margin: '4px 0 0', fontSize: '.72rem', color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>;
}

const CONDITION_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Used', label: 'Used' },
  { value: 'Antique', label: 'Antique' },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: 'simple', label: 'Simple' },
  { value: 'variable', label: 'Variable' },
];

export default function EditProduct({ data, setEdit, subCategories }) {
  const [notifySuccess, notifyError] = useNotification();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productName:        data?.productName        ?? '',
    productDescription: data?.productDescription ?? '',
    brandArtist:        data?.brandArtist        ?? '',
    subCategory:        data?.subcategory        ?? '',
    productType:        data?.productType        ?? 'simple',
    regularPrice:       data?.regularPrice       ?? '',
    salesPrice:         data?.salesPrice         ?? '',
    inStock:            data?.inStock            ?? '',
    // Sculpture
    weight:     data?.weight     ?? '',
    width:      data?.width      ?? '',
    height:     data?.height     ?? '',
    technique:  data?.technique  ?? '',
    // Textiles
    yard:       data?.yard       ?? '',
    fabricType: data?.fabricType ?? '',
    pattern:    data?.pattern    ?? '',
    // Pottery
    diameter:   data?.diameter   ?? '',
    clayType:   data?.clayType   ?? '',
    glaze:      data?.glaze      ?? '',
    // Jewelry
    length:     data?.length     ?? '',
    stoneType:  data?.stoneType  ?? '',
    metalType:  data?.metalType  ?? '',
    // Paintings
    medium:     data?.medium     ?? '',
    condition:  data?.condition  ?? '',
    size:       data?.size       ?? '',
  });

  const images = data?.images ?? [];

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setFromEvent = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const category = data?.category;

  const buildPayload = () => {
    const base = {
      productName:        form.productName,
      productDescription: form.productDescription,
      brandArtist:        form.brandArtist,
      subcategory:        form.subCategory,
      productType:        form.productType,
      regularPrice:       Number(form.regularPrice),
      salesPrice:         Number(form.salesPrice),
      inStock:            Number(form.inStock),
      images,
    };

    if (category === 'Sculpture') {
      Object.assign(base, { weight: form.weight, width: form.width, height: form.height, technique: form.technique });
    } else if (category === 'Textiles/Fabrics') {
      Object.assign(base, { weight: form.weight, yard: form.yard, fabricType: form.fabricType, pattern: form.pattern });
    } else if (category === 'Pottery') {
      Object.assign(base, { diameter: form.diameter, clayType: form.clayType, height: form.height, glaze: form.glaze });
    } else if (category === 'Paintings') {
      Object.assign(base, { medium: form.medium, condition: form.condition, size: form.size });
    } else if (category === 'Jewelry') {
      Object.assign(base, { length: form.length, diameter: form.diameter, stoneType: form.stoneType, metalType: form.metalType });
    }

    return base;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await editProduct(data?._id || data?.id, buildPayload());
      notifySuccess('Product updated successfully');
      setEdit(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Sticky header */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
        padding: '16px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setEdit(false)}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <BackIcon size={16} />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: '.72rem', color: '#9ca3af', fontWeight: 500 }}>Editing</p>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{data?.productName || 'Product'}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setEdit(false)}
            style={{ height: 36, padding: '0 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '.84rem', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{ height: 36, padding: '0 20px', borderRadius: 8, border: 'none', background: loading ? '#fca5a5' : 'var(--oosriPrimary)', fontSize: '.84rem', fontWeight: 600, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background .15s' }}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>

        {/* Left: form sections */}
        <div>
          <SectionCard title="Basic Information">
            <Field label="Product Name" hint="Keep it under 40 characters">
              <Input
                style={inputStyle}
                value={form.productName}
                onChange={setFromEvent('productName')}
                placeholder="e.g. Hand-carved Wooden Mask"
              />
            </Field>
            <Row>
              <Field label="Brand / Artist">
                <Input
                  style={inputStyle}
                  value={form.brandArtist}
                  onChange={setFromEvent('brandArtist')}
                  placeholder="Brand or artist name"
                />
              </Field>
              <Field label="Subcategory">
                <Select
                  style={{ width: '100%' }}
                  options={subCategories}
                  value={form.subCategory || undefined}
                  onChange={set('subCategory')}
                  placeholder="Select subcategory"
                />
              </Field>
            </Row>
            <Row>
              <Field label="Product Type">
                <Select
                  style={{ width: '100%' }}
                  options={PRODUCT_TYPE_OPTIONS}
                  value={form.productType}
                  onChange={set('productType')}
                />
              </Field>
              <Field label="Stock Quantity">
                <InputNumber
                  style={{ ...inputStyle }}
                  min={0}
                  value={form.inStock}
                  onChange={set('inStock')}
                  placeholder="0"
                />
              </Field>
            </Row>
            <Field label="Description">
              <TextArea
                rows={5}
                style={{ borderRadius: 8, fontSize: '.84rem' }}
                value={form.productDescription}
                onChange={setFromEvent('productDescription')}
                placeholder="Describe the product in detail…"
              />
            </Field>
          </SectionCard>

          <SectionCard title="Pricing (NGN)">
            <Row>
              <Field label="Regular Price (₦)" hint="Base listing price stored in Naira">
                <InputNumber
                  style={{ ...inputStyle }}
                  min={0}
                  value={form.regularPrice}
                  onChange={set('regularPrice')}
                  placeholder="e.g. 45000"
                  formatter={(v) => v ? `₦ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={(v) => v.replace(/₦\s?|(,*)/g, '')}
                />
              </Field>
              <Field label="Sales Price (₦)" hint="Leave 0 if no active promotion">
                <InputNumber
                  style={{ ...inputStyle }}
                  min={0}
                  value={form.salesPrice}
                  onChange={set('salesPrice')}
                  placeholder="e.g. 38000"
                  formatter={(v) => v ? `₦ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                  parser={(v) => v.replace(/₦\s?|(,*)/g, '')}
                />
              </Field>
            </Row>
            {form.regularPrice > 0 && form.salesPrice > 0 && form.salesPrice < form.regularPrice && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#dcfce7', borderRadius: 8 }}>
                <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#16a34a' }}>
                  {Math.round((1 - form.salesPrice / form.regularPrice) * 100)}% discount active
                </span>
              </div>
            )}
          </SectionCard>

          {/* Category-specific attributes */}
          {category === 'Sculpture' && (
            <SectionCard title="Sculpture Attributes">
              <Row>
                <Field label="Weight (kg)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.weight} onChange={set('weight')} placeholder="e.g. 2.5" />
                </Field>
                <Field label="Width (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.width} onChange={set('width')} placeholder="e.g. 30" />
                </Field>
              </Row>
              <Row>
                <Field label="Height (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.height} onChange={set('height')} placeholder="e.g. 50" />
                </Field>
                <Field label="Technique">
                  <Input style={inputStyle} value={form.technique} onChange={setFromEvent('technique')} placeholder="e.g. Hand-carved" />
                </Field>
              </Row>
            </SectionCard>
          )}

          {category === 'Textiles/Fabrics' && (
            <SectionCard title="Textile Attributes">
              <Row>
                <Field label="Weight (kg)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.weight} onChange={set('weight')} placeholder="e.g. 0.5" />
                </Field>
                <Field label="Yard">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.yard} onChange={set('yard')} placeholder="e.g. 6" />
                </Field>
              </Row>
              <Row>
                <Field label="Fabric Type">
                  <Input style={inputStyle} value={form.fabricType} onChange={setFromEvent('fabricType')} placeholder="e.g. Kente, Ankara" />
                </Field>
                <Field label="Pattern">
                  <Input style={inputStyle} value={form.pattern} onChange={setFromEvent('pattern')} placeholder="e.g. Geometric" />
                </Field>
              </Row>
            </SectionCard>
          )}

          {category === 'Pottery' && (
            <SectionCard title="Pottery Attributes">
              <Row>
                <Field label="Diameter (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.diameter} onChange={set('diameter')} placeholder="e.g. 20" />
                </Field>
                <Field label="Height (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.height} onChange={set('height')} placeholder="e.g. 35" />
                </Field>
              </Row>
              <Row>
                <Field label="Clay Type">
                  <Input style={inputStyle} value={form.clayType} onChange={setFromEvent('clayType')} placeholder="e.g. Terracotta" />
                </Field>
                <Field label="Glaze">
                  <Input style={inputStyle} value={form.glaze} onChange={setFromEvent('glaze')} placeholder="e.g. Matte black" />
                </Field>
              </Row>
            </SectionCard>
          )}

          {category === 'Paintings' && (
            <SectionCard title="Painting Attributes">
              <Row>
                <Field label="Medium">
                  <Input style={inputStyle} value={form.medium} onChange={setFromEvent('medium')} placeholder="e.g. Oil on canvas" />
                </Field>
                <Field label="Size">
                  <Input style={inputStyle} value={form.size} onChange={setFromEvent('size')} placeholder='e.g. 24" × 36"' />
                </Field>
              </Row>
              <Field label="Condition">
                <Select style={{ width: '100%' }} options={CONDITION_OPTIONS} value={form.condition} onChange={set('condition')} placeholder="Select condition" />
              </Field>
            </SectionCard>
          )}

          {category === 'Jewelry' && (
            <SectionCard title="Jewelry Attributes">
              <Row>
                <Field label="Length (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.length} onChange={set('length')} placeholder="e.g. 45" />
                </Field>
                <Field label="Diameter (cm)">
                  <InputNumber style={{ ...inputStyle }} min={0} value={form.diameter} onChange={set('diameter')} placeholder="e.g. 2" />
                </Field>
              </Row>
              <Row>
                <Field label="Stone Type">
                  <Input style={inputStyle} value={form.stoneType} onChange={setFromEvent('stoneType')} placeholder="e.g. Amethyst" />
                </Field>
                <Field label="Metal Type">
                  <Input style={inputStyle} value={form.metalType} onChange={setFromEvent('metalType')} placeholder="e.g. Sterling Silver" />
                </Field>
              </Row>
            </SectionCard>
          )}
        </div>

        {/* Right: images (read-only — managed by seller) */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <p style={cardTitleStyle}>Product Images</p>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {images.filter(Boolean).length > 0 ? (
              <>
                <img
                  src={images[0]}
                  alt=""
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
                />
                {images.filter(Boolean).length > 1 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {images.filter(Boolean).slice(1).map((src, i) => (
                      <img key={i} src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ height: 120, background: '#f8fafc', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '.78rem', color: '#9ca3af' }}>No images uploaded</span>
              </div>
            )}
            <p style={{ margin: '4px 0 0', fontSize: '.72rem', color: '#9ca3af', lineHeight: 1.5 }}>
              Images are managed by the seller. Contact the seller to update them.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

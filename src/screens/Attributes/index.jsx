import { useState, useEffect } from 'react';
import { Table, Popover, message, Modal, Form, Input, Select } from 'antd';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '@/network/attribute';

const { Option } = Select;

/* ─── wrapper (scoped styles only for the table page, not the modal) ─── */
const AttributesWrapper = styled.div`
  .attr__table__section {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }
  .toolbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap;
  }
  .search__box {
    display: flex; align-items: center; gap: 8px; height: 38px;
    border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 12px;
    background: #f8fafc; width: 280px; transition: border-color .15s, box-shadow .15s;
    &:focus-within {
      border-color: var(--oosriPrimary); background: #fff;
      box-shadow: 0 0 0 3px rgba(252,83,83,.1);
    }
    input {
      border: none; outline: none; background: transparent;
      font-size: .83rem; color: #111827; width: 100%; font-family: inherit;
      &::placeholder { color: #9ca3af; }
    }
    svg { color: #9ca3af; flex-shrink: 0; }
  }
  .add__btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 38px; padding: 0 16px; background: var(--oosriPrimary);
    color: #fff; border: none; border-radius: 8px; font-size: .84rem;
    font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s;
    &:hover { background: #e03d3d; }
  }
  /* table */
  .attr__label { font-size: .84rem; font-weight: 600; color: #111827; }
  .attr__code  { font-size: .75rem; color: #9ca3af; font-family: monospace; margin-top: 1px; }
  .ant-table-thead > tr > th {
    background: #f8fafc !important; font-size: .75rem; font-weight: 600;
    color: #6b7280; text-transform: uppercase; letter-spacing: .04em;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .ant-table-tbody > tr > td {
    font-size: .84rem; color: #374151;
    border-bottom: 1px solid #f1f5f9 !important; padding: 12px 16px;
  }
  .ant-table-tbody > tr:hover > td { background: #fafbfc !important; }
  .ant-pagination { padding: 12px 20px; display: flex; justify-content: flex-end; }
`;

/* ─── type pill colours ──────────────────────────────────────────────── */
const TYPE_STYLE = {
  text:        { bg: '#f1f5f9', color: '#475569' },
  number:      { bg: '#eff6ff', color: '#1d4ed8' },
  select:      { bg: '#f5f3ff', color: '#7c3aed' },
  multiselect: { bg: '#eef2ff', color: '#4338ca' },
  boolean:     { bg: '#f0fdf4', color: '#15803d' },
  date:        { bg: '#fff7ed', color: '#c2410c' },
  rich_text:   { bg: '#fdf2f8', color: '#9d174d' },
  object:      { bg: '#f8fafc', color: '#334155' },
};

function TypePill({ type }) {
  const { bg, color } = TYPE_STYLE[type] || TYPE_STYLE.text;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: '.73rem', fontWeight: 700, background: bg, color,
      textTransform: 'uppercase', letterSpacing: '.04em',
    }}>
      {type?.replace('_', ' ') || '—'}
    </span>
  );
}

function RequiredPill({ value }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: '.73rem', fontWeight: 700,
      background: value ? '#fee2e2' : '#f1f5f9',
      color: value ? '#dc2626' : '#64748b',
    }}>
      {value ? 'Required' : 'Optional'}
    </span>
  );
}

/* ─── action menu (popover, already outside wrapper so inline styles ok) */
function ActionMenu({ onEdit, onDelete }) {
  const [hov, setHov] = useState(null);
  const item = (key, danger) => ({
    width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6,
    border: 'none', fontSize: '.83rem', fontWeight: 500, cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
    color: danger ? '#dc2626' : '#111827',
    background: hov === key ? (danger ? '#fef2f2' : '#f5f5f5') : 'none',
    transition: 'background .1s',
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 160, padding: 4 }}>
      <button style={item('edit')} onClick={onEdit} onMouseEnter={() => setHov('edit')} onMouseLeave={() => setHov(null)}>Edit</button>
      <button style={item('del', true)} onClick={onDelete} onMouseEnter={() => setHov('del')} onMouseLeave={() => setHov(null)}>Delete</button>
    </div>
  );
}

/* ─── shared modal button atoms ─────────────────────────────────────── */
function PrimaryBtn({ children, onClick, disabled, type = 'button', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: '0 20px', borderRadius: 8, border: 'none',
        background: disabled ? '#fca5a5' : hov ? '#e03d3d' : 'var(--oosriPrimary)',
        color: '#fff', fontSize: '.84rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        transition: 'background .15s', ...style,
      }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: '0 16px', borderRadius: 8,
        border: '1px solid #e2e8f0', background: hov ? '#f8fafc' : '#fff',
        color: '#374151', fontSize: '.84rem', fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s',
      }}
    >{children}</button>
  );
}

const lbl = { display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 };
const inputSt = { width: '100%', borderRadius: 8, fontSize: '.84rem', height: 38 };

/* ─── screen ─────────────────────────────────────────────────────────── */
export default function AttributesScreen() {
  const [attributes,       setAttributes]       = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [submitting,       setSubmitting]        = useState(false);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [attributeType,    setAttributeType]    = useState('text');
  const [form] = Form.useForm();

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await getAttributes();
      if (res?.data?.success) setAttributes(res.data.data);
    } catch {
      message.error('Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttributes(); }, []);

  const filtered = attributes.filter((a) =>
    a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (record) => {
    setEditingAttribute(record);
    setAttributeType(record.type);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingAttribute(null);
    setAttributeType('text');
    form.resetFields();
    form.setFieldsValue({ type: 'text', isRequired: false });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingAttribute(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingAttribute) {
        await updateAttribute(editingAttribute._id, values);
        message.success('Attribute updated');
      } else {
        await createAttribute(values);
        message.success('Attribute created');
      }
      closeModal();
      fetchAttributes();
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttribute(id);
      message.success('Attribute deleted');
      fetchAttributes();
    } catch {
      message.error('Failed to delete attribute');
    }
  };

  /* ── table columns ─────────────────────────────────────────────── */
  const columns = [
    {
      title: 'Attribute',
      key: 'label',
      render: (_, r) => (
        <div>
          <p className="attr__label">{r.label}</p>
          <p className="attr__code">{r.code}</p>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (v) => <TypePill type={v} />,
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      key: 'required',
      width: 110,
      render: (v) => <RequiredPill value={v} />,
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      render: (opts) => {
        if (!opts?.length) return <span style={{ color: '#9ca3af', fontSize: '.8rem' }}>—</span>;
        const visible = opts.slice(0, 4);
        const rest = opts.length - 4;
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {visible.map((o) => (
              <span key={o} style={{
                padding: '2px 8px', borderRadius: 6, background: '#f1f5f9',
                fontSize: '.75rem', fontWeight: 500, color: '#374151',
              }}>{o}</span>
            ))}
            {rest > 0 && (
              <span style={{
                padding: '2px 8px', borderRadius: 6, background: '#e2e8f0',
                fontSize: '.75rem', fontWeight: 600, color: '#64748b',
              }}>+{rest}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'desc',
      render: (v) => <span style={{ fontSize: '.8rem', color: '#6b7280' }}>{v || '—'}</span>,
    },
    {
      title: '',
      key: 'action',
      width: 48,
      render: (_, record) => (
        <Popover
          content={<ActionMenu onEdit={() => openEdit(record)} onDelete={() => handleDelete(record._id)} />}
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

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <AttributesWrapper>
      <div className="attr__table__section">
        <div className="toolbar">
          <div className="search__box">
            <SearchIcon size={16} />
            <input
              placeholder="Search attributes…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add__btn" onClick={openCreate}>
            <PlusOutlined /> Add Attribute
          </button>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: false }}
          locale={{ emptyText: 'No attributes found' }}
        />
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────── */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={540}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {editingAttribute ? 'Edit Attribute' : 'New Attribute'}
          </p>
          <h3 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
            {editingAttribute ? editingAttribute.label : 'Define an attribute'}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', maxHeight: '65vh', overflowY: 'auto' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ type: 'text', isRequired: false }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Label + Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Label <span style={{ color: '#ef4444' }}>*</span></label>
                  <Form.Item name="label" noStyle rules={[{ required: true, message: 'Label is required' }]}>
                    <Input style={inputSt} placeholder="e.g. Fabric Material" />
                  </Form.Item>
                </div>
                <div>
                  <label style={lbl}>Code (unique) <span style={{ color: '#ef4444' }}>*</span></label>
                  <Form.Item name="code" noStyle rules={[{ required: true, message: 'Code is required' }]}>
                    <Input
                      style={{ ...inputSt, background: editingAttribute ? '#f8fafc' : undefined, color: editingAttribute ? '#9ca3af' : undefined }}
                      placeholder="fabric_material"
                      disabled={!!editingAttribute}
                    />
                  </Form.Item>
                  {editingAttribute && (
                    <p style={{ margin: '4px 0 0', fontSize: '.71rem', color: '#9ca3af' }}>Code cannot be changed after creation</p>
                  )}
                </div>
              </div>

              {/* Type + Required */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Input Type <span style={{ color: '#ef4444' }}>*</span></label>
                  <Form.Item name="type" noStyle rules={[{ required: true }]}>
                    <Select style={{ width: '100%' }} onChange={(v) => setAttributeType(v)}>
                      <Option value="text">Text</Option>
                      <Option value="number">Number</Option>
                      <Option value="select">Select (single)</Option>
                      <Option value="multiselect">Multi-Select</Option>
                      <Option value="boolean">Boolean (Yes / No)</Option>
                      <Option value="date">Date</Option>
                      <Option value="rich_text">Rich Text</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div>
                  <label style={lbl}>Requirement</label>
                  <Form.Item name="isRequired" noStyle>
                    <Select style={{ width: '100%' }}>
                      <Option value={false}>Optional</Option>
                      <Option value={true}>Mandatory</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/* Options (only for select / multiselect) */}
              {['select', 'multiselect'].includes(attributeType) && (
                <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                  <label style={{ ...lbl, marginBottom: 8 }}>
                    Options <span style={{ color: '#ef4444' }}>*</span>
                    <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: '.72rem', marginLeft: 6 }}>press Enter to add each value</span>
                  </label>
                  <Form.Item name="options" noStyle rules={[{ required: true, message: 'Add at least one option' }]}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="Type a value and press Enter…"
                      tokenSeparators={[',']}
                    />
                  </Form.Item>
                </div>
              )}

              {/* Validation (number type only) */}
              {attributeType === 'number' && (
                <div style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                  <p style={{ margin: '0 0 10px', fontSize: '.78rem', fontWeight: 700, color: '#374151' }}>Validation Range</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ ...lbl, marginBottom: 4 }}>Min</label>
                      <Form.Item name={['validation', 'min']} noStyle>
                        <Input style={inputSt} type="number" placeholder="e.g. 0" />
                      </Form.Item>
                    </div>
                    <div>
                      <label style={{ ...lbl, marginBottom: 4 }}>Max</label>
                      <Form.Item name={['validation', 'max']} noStyle>
                        <Input style={inputSt} type="number" placeholder="e.g. 9999" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label style={lbl}>Description</label>
                <Form.Item name="description" noStyle>
                  <Input.TextArea
                    rows={3}
                    placeholder="What is this attribute used for?"
                    style={{ borderRadius: 8, fontSize: '.84rem', resize: 'none' }}
                  />
                </Form.Item>
              </div>

            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <GhostBtn onClick={closeModal}>Cancel</GhostBtn>
              <PrimaryBtn type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : editingAttribute ? 'Save Changes' : 'Create Attribute'}
              </PrimaryBtn>
            </div>
          </Form>
        </div>
      </Modal>
    </AttributesWrapper>
  );
}

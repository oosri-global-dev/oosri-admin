import { useState, useEffect } from 'react';
import { Table, Popover, message, Modal, Form, Input, Select, Tag } from 'antd';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { PlusOutlined } from '@ant-design/icons';
import { AllCategoriesWrapper as AttributesWrapper } from '../Categories/AllCategories/all-categories.styles';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '@/network/attribute';

const { Option } = Select;

function ActionMenu({ onEdit, onDelete }) {
  const [hov, setHov] = useState(null);
  const item = (key, danger) => ({
    width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6,
    border: 'none', fontSize: '.83rem', fontWeight: 500, cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .1s',
    color: danger ? '#dc2626' : '#111827',
    background: hov === key ? (danger ? '#fef2f2' : '#f5f5f5') : 'none',
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 180, padding: 4 }}>
      <button style={item('edit')} onClick={onEdit} onMouseEnter={() => setHov('edit')} onMouseLeave={() => setHov(null)}>Edit</button>
      <button style={item('del', true)} onClick={onDelete} onMouseEnter={() => setHov('del')} onMouseLeave={() => setHov(null)}>Delete</button>
    </div>
  );
}

export default function AttributesScreen() {
  const [attributes,        setAttributes]        = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [searchTerm,        setSearchTerm]        = useState('');
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [editingAttribute,  setEditingAttribute]  = useState(null);
  const [attributeType,     setAttributeType]     = useState('text');
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

  const handleSubmit = async (values) => {
    try {
      if (editingAttribute) {
        await updateAttribute(editingAttribute._id, values);
        message.success('Attribute updated');
      } else {
        await createAttribute(values);
        message.success('Attribute created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingAttribute(null);
      fetchAttributes();
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
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

  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <div>
          <p className="cat__name">{text}</p>
          <p className="cat__desc">{record.code}</p>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v) => <Tag color="blue">{(v || '').toUpperCase()}</Tag>,
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      key: 'required',
      render: (v) => (
        <span style={{
          display: 'inline-block', padding: '2px 10px', borderRadius: 20,
          fontSize: '.73rem', fontWeight: 700,
          background: v ? '#fee2e2' : '#f1f5f9',
          color: v ? '#dc2626' : '#475569',
        }}>
          {v ? 'Required' : 'Optional'}
        </span>
      ),
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      render: (opts) => opts?.length
        ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{opts.map((o) => <Tag key={o}>{o}</Tag>)}</div>
        : <span className="cat__desc">—</span>,
    },
    {
      title: '',
      key: 'action',
      width: 48,
      render: (_, record) => (
        <Popover
          content={
            <ActionMenu
              onEdit={() => openEdit(record)}
              onDelete={() => handleDelete(record._id)}
            />
          }
          trigger="click"
          placement="bottomRight"
        >
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, color: '#9ca3af' }}
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
    <AttributesWrapper>
      <div className="categories__table__section">
        <div className="search__body__section">
          <div className="search__section">
            <SearchIcon size={16} color="#9ca3af" />
            <input
              placeholder="Search attributes…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text__field__custom"
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

      <Modal
        title={editingAttribute ? 'Edit Attribute' : 'Add Attribute'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={560}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}
          initialValues={{ type: 'text', isRequired: false }}
          style={{ marginTop: 20 }}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="label" label="Label" rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 16 }}>
              <Input style={{ height: 40 }} placeholder="e.g. Fabric Material" />
            </Form.Item>
            <Form.Item name="code" label="Code (unique)" rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 16 }}>
              <Input style={{ height: 40 }} placeholder="fabric_material" disabled={!!editingAttribute} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="type" label="Input Type" rules={[{ required: true }]} style={{ flex: 1, marginBottom: 16 }}>
              <Select style={{ height: 40 }} onChange={(v) => setAttributeType(v)}>
                <Option value="text">Text</Option>
                <Option value="number">Number</Option>
                <Option value="select">Select</Option>
                <Option value="multiselect">Multi-Select</Option>
                <Option value="boolean">Boolean (Yes/No)</Option>
                <Option value="date">Date</Option>
                <Option value="rich_text">Rich Text</Option>
              </Select>
            </Form.Item>
            <Form.Item name="isRequired" label="Requirement" style={{ flex: 1, marginBottom: 16 }}>
              <Select style={{ height: 40 }}>
                <Option value={true}>Mandatory</Option>
                <Option value={false}>Optional</Option>
              </Select>
            </Form.Item>
          </div>

          {['select', 'multiselect'].includes(attributeType) && (
            <Form.Item name="options" label="Options (press Enter to add)" rules={[{ required: true, message: 'Add at least one option' }]}>
              <Select mode="tags" style={{ width: '100%' }} placeholder="Add options…" />
            </Form.Item>
          )}

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="What is this attribute used for?" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <button type="submit" className="submit__btn">
              {editingAttribute ? 'Update Attribute' : 'Create Attribute'}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </AttributesWrapper>
  );
}

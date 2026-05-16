import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Tag, Button, Modal, Form, Input, Select, Checkbox, message } from 'antd';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/network/adminManagement';

const ALL_PERMISSIONS = [
  'orders', 'products', 'sellers', 'buyers',
  'analytics', 'categories', 'attributes',
  'payouts', 'fx', 'settings',
];

const ROLE_COLOR = { super_admin: 'gold', admin: 'blue' };

function PermissionsCell({ record }) {
  if (record.userRoles === 'super_admin') {
    return <Tag color="gold">All (Super Admin)</Tag>;
  }
  if (!record.permissions?.length) return <span style={{ color: '#9ca3af' }}>None</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {record.permissions.map((p) => <Tag key={p}>{p}</Tag>)}
    </div>
  );
}

function AdminModal({ open, onClose, initial }) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isEdit = !!initial;

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit ? updateAdmin(initial.id, values) : createAdmin(values),
    onSuccess: () => {
      message.success(isEdit ? 'Admin updated' : 'Admin created and credentials sent by email');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      onClose();
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Something went wrong');
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      mutation.mutate(values);
    } catch { /* validation errors shown inline */ }
  };

  const initialValues = initial
    ? { fullName: initial.fullName, phoneNumber: initial.phoneNumber, userRoles: initial.userRoles, permissions: initial.permissions ?? [] }
    : { userRoles: 'admin', permissions: [] };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit Admin' : 'Create Admin'}
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Save' : 'Create'}
      confirmLoading={mutation.isPending}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues} style={{ marginTop: 16 }}>
        {!isEdit && (
          <>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="admin@example.com" />
            </Form.Item>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Jane Doe" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="+234..." />
            </Form.Item>
          </>
        )}
        {isEdit && (
          <>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number">
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item name="userRoles" label="Role" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="super_admin">Super Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, cur) => prev.userRoles !== cur.userRoles}
        >
          {({ getFieldValue }) =>
            getFieldValue('userRoles') !== 'super_admin' && (
              <Form.Item name="permissions" label="Permissions">
                <Checkbox.Group style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 0' }}>
                  {ALL_PERMISSIONS.map((p) => (
                    <Checkbox key={p} value={p} style={{ textTransform: 'capitalize' }}>
                      {p}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default function AdminsScreen() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
    select: (d) => d?.body ?? [],
  });

  const removeMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      message.success('Admin deleted');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (err) => message.error(err?.response?.data?.message || 'Failed to delete'),
  });

  const handleDelete = (admin) => {
    Modal.confirm({
      title: `Delete ${admin.fullName}?`,
      content: 'This action cannot be undone.',
      okText: 'Delete', okType: 'danger', cancelText: 'Cancel',
      onOk: () => removeMutation.mutate(admin.id),
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      render: (name, record) => (
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '.84rem' }}>{name}</p>
          <p style={{ margin: 0, fontSize: '.75rem', color: '#6b7280' }}>{record.email}</p>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'userRoles',
      render: (role) => (
        <Tag color={ROLE_COLOR[role] || 'default'} style={{ textTransform: 'capitalize' }}>
          {role?.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Permissions',
      render: (_, record) => <PermissionsCell record={record} />,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      render: (v) => v || '—',
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<MdEdit size={14} />}
            onClick={() => { setEditing(record); setModalOpen(true); }}
          />
          {record.userRoles !== 'super_admin' && (
            <Button
              size="small"
              danger
              icon={<MdDelete size={14} />}
              onClick={() => handleDelete(record)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Admin Management</h2>
          <p style={{ margin: 0, fontSize: '.82rem', color: '#6b7280' }}>
            Manage admins and their module permissions
          </p>
        </div>
        <Button
          type="primary"
          icon={<MdAdd size={16} />}
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          Add Admin
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        size="middle"
      />

      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        initial={editing}
      />
    </div>
  );
}

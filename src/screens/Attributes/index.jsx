import { useState, useEffect } from 'react';
import { Table, Space, Popover, message, Modal, Form, Input, Select, Tag } from 'antd';
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { PlusOutlined } from '@ant-design/icons';
import { AllCategoriesWrapper as AttributesWrapper } from '../Categories/AllCategories/all-categories.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import TextField from '@/components/lib/TextField';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '@/network/attribute';

const { Option } = Select;

export default function AttributesScreen() {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [form] = Form.useForm();
    const [attributeType, setAttributeType] = useState('text');

    const fetchAttributes = async () => {
        setLoading(true);
        try {
            const response = await getAttributes();
            if (response?.data?.success) {
                setAttributes(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch attributes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAttributes = attributes.filter(attr =>
        attr.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrUpdate = async (values) => {
        try {
            if (editingAttribute) {
                await updateAttribute(editingAttribute._id, values);
                message.success('Attribute updated successfully');
            } else {
                await createAttribute(values);
                message.success('Attribute created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingAttribute(null);
            fetchAttributes();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAttribute(id);
            message.success('Attribute deleted successfully');
            fetchAttributes();
        } catch (error) {
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
                    <div style={{ fontWeight: 600 }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{record.code}</div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>
        },
        {
            title: 'Required',
            dataIndex: 'isRequired',
            key: 'isRequired',
            render: (required) => required ? <Tag color="red">YES</Tag> : <Tag color="default">NO</Tag>
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            render: (options) => options?.length > 0 ? (
                <div style={{ maxWidth: '200px' }}>
                    {options.map(opt => <Tag key={opt} style={{ marginBottom: '4px' }}>{opt}</Tag>)}
                </div>
            ) : '-'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popover
                    content={
                        <div className="popover__custom" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Button
                                height="30px"
                                radius="5px"
                                width="100%"
                                onClick={() => {
                                    setEditingAttribute(record);
                                    setAttributeType(record.type);
                                    form.setFieldsValue(record);
                                    setIsModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                height="30px"
                                radius="5px"
                                width="100%"
                                onClick={() => handleDelete(record._id)}
                                style={{ color: 'red' }}
                            >
                                Delete
                            </Button>
                        </div>
                    }
                    trigger="click"
                >
                    <EllipsisIcon style={{ cursor: 'pointer' }} />
                </Popover>
            ),
        },
    ];

    return (
        <AttributesWrapper>
                <FlexibleDiv flexDir="column" className="categories__table__section">
                    <FlexibleDiv flexDir="row" justifyContent="space-between" className="search__body__section" width="100%">
                        <FlexibleDiv className="search__section" flexDir="row" flexWrap="nowrap">
                            <SearchIcon size={18} color="#9E9E9E" />
                            <TextField
                                placeholder="Search attributes"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="text__field__custom"
                            />
                        </FlexibleDiv>
                        <Button
                            onClick={() => {
                                setEditingAttribute(null);
                                setAttributeType('text');
                                form.resetFields();
                                form.setFieldsValue({ type: 'text', isRequired: false });
                                setIsModalOpen(true);
                            }}
                            startIcon={<PlusOutlined />}
                            bg="var(--oosriPrimary)"
                            color="#fff"
                        >
                            Add Attribute
                        </Button>
                    </FlexibleDiv>

                    <div className="categories__table__wrapper">
                        <Table
                            columns={columns}
                            dataSource={filteredAttributes}
                            rowKey="_id"
                            loading={loading}
                        />
                    </div>
                </FlexibleDiv>

                <Modal
                    title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateOrUpdate}
                        initialValues={{ type: 'text', isRequired: false }}
                        style={{ marginTop: '20px' }}
                    >
                        <FlexibleDiv gap="20px">
                            <Form.Item
                                name="label"
                                label="Label (e.g. Fabric Material)"
                                rules={[{ required: true, message: 'Required' }]}
                                style={{ flex: 1 }}
                            >
                                <Input placeholder="Attribute Label" height="40px" />
                            </Form.Item>
                            <Form.Item
                                name="code"
                                label="Code (Unique identifier)"
                                rules={[{ required: true, message: 'Required' }]}
                                style={{ flex: 1 }}
                            >
                                <Input placeholder="attribute_code" height="40px" disabled={!!editingAttribute} />
                            </Form.Item>
                        </FlexibleDiv>

                        <FlexibleDiv gap="20px">
                            <Form.Item
                                name="type"
                                label="Input Type"
                                rules={[{ required: true }]}
                                style={{ flex: 1 }}
                            >
                                <Select onChange={val => setAttributeType(val)}>
                                    <Option value="text">Text</Option>
                                    <Option value="number">Number</Option>
                                    <Option value="select">Select</Option>
                                    <Option value="multiselect">Multi-Select</Option>
                                    <Option value="boolean">Boolean (Yes/No)</Option>
                                    <Option value="date">Date</Option>
                                    <Option value="rich_text">Rich Text</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="isRequired"
                                label="Global Requirement"
                                valuePropName="checked"
                                style={{ flex: 1 }}
                            >
                                <Select>
                                    <Option value={true}>Mandatory</Option>
                                    <Option value={false}>Optional</Option>
                                </Select>
                            </Form.Item>
                        </FlexibleDiv>

                        {['select', 'multiselect'].includes(attributeType) && (
                            <Form.Item
                                name="options"
                                label="Select Options (Press Enter to add)"
                                rules={[{ required: true, message: 'At least one option required' }]}
                            >
                                <Select mode="tags" style={{ width: '100%' }} placeholder="Add options..." />
                            </Form.Item>
                        )}

                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={3} placeholder="Explain what this attribute is for..." />
                        </Form.Item>

                        <Form.Item style={{ marginTop: '20px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                width="100%"
                                bg="var(--oosriPrimary)"
                                color="#fff"
                                height="40px"
                            >
                                {editingAttribute ? "Update Attribute" : "Create Attribute"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </AttributesWrapper>
    );
}

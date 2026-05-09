import { useState, useEffect } from 'react';
import { Table, Space, Avatar, Popover, message, Modal, Form, Input, Upload, Select } from 'antd';

const { Option } = Select;
import { IoSearchOutline as SearchIcon } from 'react-icons/io5';
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from 'react-icons/hi2';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { AllCategoriesWrapper } from './all-categories.styles';
import { FlexibleDiv } from '@/components/lib/Box/styles';
import Button from '@/components/lib/Button';
import TextField from '@/components/lib/TextField';
import { getCategories, createCategory, updateCategory, deleteCategory, createSubcategory, getSubcategories, updateSubcategory } from '@/network/category';
import { getAttributes } from '@/network/attribute';

import { uploadToCloudinary } from '@/network/upload';

export default function AllCategoriesScreen() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [form] = Form.useForm();
    const [subForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [globalAttributes, setGlobalAttributes] = useState([]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories();
            if (response?.data?.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            message.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchGlobalAttributes = async () => {
        try {
            const res = await getAttributes();
            if (res.data.success) {
                setGlobalAttributes(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch globals:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchGlobalAttributes();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrUpdate = async (values) => {
        setIsSubmitting(true);
        try {
            let secure_url = '';
            
            if (fileList.length > 0) {
                const f = fileList[0];
                if (f.status === 'uploading') {
                    message.error('Please wait for the image upload to finish before saving.');
                    return;
                }
                secure_url = f.response || f.url || '';
            }

            const payload = {
                name: values.name,
                description: values.description,
                attributes: values.attributes || []
            };
            if (secure_url) {
                payload.image = secure_url;
            }

            if (editingCategory) {
                await updateCategory(editingCategory._id, payload, false);
                message.success('Category updated successfully');
            } else {
                await createCategory(payload, false);
                message.success('Category created successfully');
            }

            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error('Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            message.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            message.error('Failed to delete category');
        }
    };

    const handleManageSubcategories = async (category) => {
        setSelectedCategoryForSub(category);
        setIsSubModalOpen(true);
        // Fetch subcategories if needed, but they are already included in category object from getCategories aggregation
        // If we want fresh data:
        // const res = await getSubcategories(category._id);
        // setSubcategories(res.data.data);
        setSubcategories(category.subcategories || []);
    };

    const handleCreateSubcategory = async (values) => {
        try {
            await createSubcategory({ ...values, categoryId: selectedCategoryForSub._id });
            message.success('Subcategory created');
            subForm.resetFields();
            fetchCategories(); // Refresh to update the list and subcategory counts
            // Also update local subcategories list if we want immediate feedback in the modal without closing
            const res = await getSubcategories(selectedCategoryForSub._id);
            setSubcategories(res.data.data);
        } catch (error) {
            message.error('Failed to create subcategory');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <Avatar src={image} size={50} shape="square" />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 600, color: '#262626' }}>{text}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Subcategories',
            dataIndex: 'subcategories',
            key: 'subcategories',
            render: (subs) => subs?.length || 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popover
                    content={
                        <div className="popover__custom">
                            <Button
                                height="30px"
                                radius="5px"
                                width="100%"
                                onClick={() => {
                                    setEditingCategory(record);
                                    form.setFieldsValue({
                                        name: record.name,
                                        description: record.description,
                                        attributes: record.attributes?.map(a => ({
                                            attributeId: a.attributeId,
                                            isRequired: a.isRequired,
                                            isFilterable: a.isFilterable
                                        })) || []
                                    });
                                    if (record.image) {
                                        setFileList([{
                                            uid: '-1',
                                            name: 'Category Image',
                                            status: 'done',
                                            url: record.image,
                                        }]);
                                    } else {
                                        setFileList([]);
                                    }
                                    setIsModalOpen(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                height="30px"
                                radius="5px"
                                width="100%"
                                onClick={() => handleManageSubcategories(record)}
                            >
                                Subcategories
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

    const handleCustomUpload = async ({ file, onSuccess, onError }) => {
        try {
            message.loading({ content: 'Uploading image...', key: 'uploading' });
            const secure_url = await uploadToCloudinary(file, 'categories/images');
            onSuccess(secure_url);
            message.success({ content: 'Image uploaded successfully!', key: 'uploading' });
        } catch (error) {
            onError(error);
            message.error({ content: 'Failed to upload image.', key: 'uploading' });
        }
    };

    const handleBeforeUpload = (file) => {
        const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type);
        if (!isValidType) {
            message.error('You can only upload JPG/PNG/GIF file!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <AllCategoriesWrapper>
            <FlexibleDiv
                flexDir="column"
                alignItems="flex-start"
                className="categories__table__section"
            >
                <FlexibleDiv
                    flexDir="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="search__body__section"
                    width="100%"
                >
                    <div className="search__section">
                        <SearchIcon size={18} color="#9E9E9E" />
                        <TextField
                            placeholder="Search categories"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="text__field__custom"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCategory(null);
                            form.resetFields();
                            setFileList([]);
                            setIsModalOpen(true);
                        }}
                        startIcon={<PlusOutlined />}
                        bg="var(--oosriPrimary)"
                        color="#fff"
                        height="44px"
                    >
                        Add Category
                    </Button>
                </FlexibleDiv>

                <div className="categories__table__wrapper">
                    <Table
                        columns={columns}
                        dataSource={filteredCategories}
                        rowKey="_id"
                        loading={loading}
                    />
                </div>
            </FlexibleDiv>

            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateOrUpdate}
                    style={{ marginTop: '20px' }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                        style={{ marginBottom: '20px' }}
                    >
                        <Input style={{ height: '40px' }} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        style={{ marginBottom: '20px' }}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Image" style={{ marginBottom: '30px' }}>
                        <Upload
                            beforeUpload={handleBeforeUpload}
                            customRequest={handleCustomUpload}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            maxCount={1}
                            listType="picture"
                        >
                            <Button
                                icon={<UploadOutlined />}
                                bg="transparent"
                                border="1px solid var(--oosriPrimary)"
                                color="var(--oosriPrimary)"
                            >
                                Select Image
                            </Button>
                        </Upload>
                    </Form.Item>

                    <h3 style={{ marginBottom: '16px' }}>Link Attributes</h3>
                    <Form.List name="attributes">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <FlexibleDiv key={key} gap="12px" margin="0 0 16px 0" alignItems="flex-start" flexWrap="nowrap">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'attributeId']}
                                            label="Attribute"
                                            rules={[{ required: true, message: 'Missing attribute' }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Select placeholder="Select attribute" style={{ height: '40px', width: '100%' }}>
                                                {globalAttributes.map(attr => (
                                                    <Option key={attr._id} value={attr._id}>{attr.label}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'isRequired']}
                                            valuePropName="checked"
                                            label="Required"
                                            style={{ width: '100px', marginBottom: 0 }}
                                        >
                                            <Select style={{ height: '40px' }}>
                                                <Option value={true}>Yes</Option>
                                                <Option value={false}>No</Option>
                                            </Select>
                                        </Form.Item>
                                        <Button
                                            bg="transparent"
                                            color="#FF4D4F"
                                            onClick={() => remove(name)}
                                            style={{ padding: '0 8px', marginTop: '30px', border: 'none' }}
                                        >
                                            Remove
                                        </Button>
                                    </FlexibleDiv>
                                ))}
                                <Form.Item>
                                    <Button
                                        onClick={() => add()}
                                        bg="transparent"
                                        border="1px dashed #D9D9D9"
                                        color="#595959"
                                        width="100%"
                                        height="40px"
                                        hoverBg="#F5F5F5"
                                        hoverColor="#262626"
                                        hoverBorderColor="#D9D9D9"
                                    >
                                        + Add Attribute Field
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            width="100%"
                            bg="var(--oosriPrimary)"
                            color="#fff"
                            height="40px"
                            loading={isSubmitting}
                        >
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Manage Subcategories for ${selectedCategoryForSub?.name}`}
                open={isSubModalOpen}
                onCancel={() => setIsSubModalOpen(false)}
                footer={null}
                width={700}
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                <Form
                    form={subForm}
                    layout="inline"
                    onFinish={handleCreateSubcategory}
                    style={{ marginBottom: 20, display: 'flex', flexDirection: "column", gap: '10px', flexWrap: 'nowrap' }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Name required' }]}
                        style={{ flex: 1, width: "100%", margin: 0 }}
                    >
                        <Input placeholder="Subcategory Name" style={{ height: '40px' }} />
                    </Form.Item>
                    <Form.Item name="description" style={{ flex: 1, width: "100%", margin: 0 }}>
                        <Input placeholder="Description" style={{ height: '40px' }} />
                    </Form.Item>
                    <Form.Item style={{ margin: 0 }}>
                        <Button
                            htmlType="submit"
                            bg="var(--oosriPrimary)"
                            color="#fff"
                            height="40px"
                        >
                            Add
                        </Button>
                    </Form.Item>
                </Form>

                <Table
                    dataSource={subcategories}
                    rowKey="_id"
                    pagination={false}
                    columns={[
                        { title: 'Name', dataIndex: 'name' },
                        { title: 'Description', dataIndex: 'description' },
                    ]}
                />
            </Modal>
        </AllCategoriesWrapper>
    );
}

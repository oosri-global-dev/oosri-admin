import { useState, useEffect } from "react";
import { Table, Avatar, Popover, Modal, Form, Input, Upload, Select, message } from "antd";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { AllCategoriesWrapper } from "./all-categories.styles";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  createSubcategory, getSubcategories,
} from "@/network/category";
import { getAttributes } from "@/network/attribute";
import { uploadToCloudinary } from "@/network/upload";

const { Option } = Select;

/* ─── shared inline style tokens ────────────────────────────────────────── */
const label = { display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 };
const inputSt = { width: '100%', borderRadius: 8, fontSize: '.84rem', height: 38 };
const sectionGap = { display: 'flex', flexDirection: 'column', gap: 14 };
const divider = { borderTop: '1px solid #f1f5f9', margin: '16px 0 0' };

function ModalLabel({ children }) {
  return <span style={label}>{children}</span>;
}

function PrimaryBtn({ children, onClick, disabled, type = 'button', style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: '0 20px', borderRadius: 8, border: 'none',
        background: disabled ? '#fca5a5' : hov ? '#e03d3d' : 'var(--oosriPrimary)',
        color: '#fff', fontSize: '.84rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        transition: 'background .15s', ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 40, padding: '0 16px', borderRadius: 8,
        border: '1px solid #e2e8f0', background: hov ? '#f8fafc' : '#fff',
        color: '#374151', fontSize: '.84rem', fontWeight: 600,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'background .15s', ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─── main screen ────────────────────────────────────────────────────────── */
export default function AllCategoriesScreen() {
  const [categories,             setCategories]             = useState([]);
  const [loading,                setLoading]                = useState(false);
  const [isSubmitting,           setIsSubmitting]           = useState(false);
  const [searchTerm,             setSearchTerm]             = useState("");
  const [isModalOpen,            setIsModalOpen]            = useState(false);
  const [isSubModalOpen,         setIsSubModalOpen]         = useState(false);
  const [editingCategory,        setEditingCategory]        = useState(null);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState(null);
  const [subcategories,          setSubcategories]          = useState([]);
  const [subSubmitting,          setSubSubmitting]          = useState(false);
  const [form]    = Form.useForm();
  const [subForm] = Form.useForm();
  const [fileList,         setFileList]         = useState([]);
  const [globalAttributes, setGlobalAttributes] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res?.data?.success) setCategories(res.data.data);
    } catch {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalAttributes = async () => {
    try {
      const res = await getAttributes();
      if (res.data.success) setGlobalAttributes(res.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchGlobalAttributes();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      attributes: record.attributes?.map((a) => ({
        attributeId: a.attributeId,
        isRequired: a.isRequired,
        isFilterable: a.isFilterable,
      })) || [],
    });
    setFileList(record.image
      ? [{ uid: "-1", name: "Category Image", status: "done", url: record.image }]
      : []
    );
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (values) => {
    setIsSubmitting(true);
    try {
      let secure_url = "";
      if (fileList.length > 0) {
        const f = fileList[0];
        if (f.status === "uploading") { message.error("Wait for image upload to finish."); return; }
        secure_url = f.response || f.url || "";
      }
      const payload = { name: values.name, description: values.description, attributes: values.attributes || [] };
      if (secure_url) payload.image = secure_url;

      if (editingCategory) {
        await updateCategory(editingCategory._id, payload, false);
        message.success("Category updated");
      } else {
        await createCategory(payload, false);
        message.success("Category created");
      }
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      setEditingCategory(null);
      fetchCategories();
    } catch {
      message.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete this category?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success("Category deleted");
          fetchCategories();
        } catch {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const handleManageSubs = async (record) => {
    setSelectedCategoryForSub(record);
    setSubcategories(record.subcategories || []);
    setIsSubModalOpen(true);
  };

  const handleCreateSubcategory = async (values) => {
    setSubSubmitting(true);
    try {
      await createSubcategory({ ...values, categoryId: selectedCategoryForSub._id });
      message.success("Subcategory created");
      subForm.resetFields();
      const res = await getSubcategories(selectedCategoryForSub._id);
      setSubcategories(res.data.data);
      fetchCategories();
    } catch {
      message.error("Failed to create subcategory");
    } finally {
      setSubSubmitting(false);
    }
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      message.loading({ content: "Uploading…", key: "upload" });
      const url = await uploadToCloudinary(file, "categories/images");
      onSuccess(url);
      message.success({ content: "Uploaded!", key: "upload" });
    } catch (e) {
      onError(e);
      message.error({ content: "Upload failed.", key: "upload" });
    }
  };

  const handleBeforeUpload = (file) => {
    const ok = ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(file.type);
    if (!ok) { message.error("JPG/PNG/GIF only"); return Upload.LIST_IGNORE; }
    if (file.size / 1024 / 1024 > 5) { message.error("Max 5 MB"); return Upload.LIST_IGNORE; }
    return true;
  };

  /* ── action menu ─────────────────────────────────────────────────────── */
  const ActionMenu = ({ record }) => {
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
        <button style={item('edit')} onClick={() => openEdit(record)} onMouseEnter={() => setHov('edit')} onMouseLeave={() => setHov(null)}>Edit</button>
        <button style={item('subs')} onClick={() => handleManageSubs(record)} onMouseEnter={() => setHov('subs')} onMouseLeave={() => setHov(null)}>Subcategories</button>
        <button style={item('del', true)} onClick={() => handleDelete(record._id)} onMouseEnter={() => setHov('del')} onMouseLeave={() => setHov(null)}>Delete</button>
      </div>
    );
  };

  /* ── table columns ───────────────────────────────────────────────────── */
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 72,
      render: (img) => <Avatar src={img} size={44} shape="square" style={{ borderRadius: 8, background: "#f1f5f9" }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (v) => <span className="cat__name">{v}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v) => <span className="cat__desc">{v || "—"}</span>,
    },
    {
      title: "Subcategories",
      dataIndex: "subcategories",
      key: "subs",
      width: 120,
      render: (subs) => <span className="sub__count">{subs?.length || 0}</span>,
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, record) => (
        <Popover content={<ActionMenu record={record} />} trigger="click" placement="bottomRight">
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

  /* ── render ──────────────────────────────────────────────────────────── */
  return (
    <AllCategoriesWrapper>
      <div className="categories__table__section">
        <div className="search__body__section">
          <div className="search__section">
            <SearchIcon size={16} color="#9ca3af" />
            <input
              placeholder="Search categories…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text__field__custom"
            />
          </div>
          <button
            className="add__btn"
            onClick={() => { setEditingCategory(null); form.resetFields(); setFileList([]); setIsModalOpen(true); }}
          >
            <PlusOutlined /> Add Category
          </button>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No categories found" }}
        />
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────── */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingCategory(null); form.resetFields(); setFileList([]); }}
        footer={null}
        width={520}
        styles={{ body: { padding: 0 } }}
      >
        {/* Modal header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {editingCategory ? 'Edit Category' : 'New Category'}
          </p>
          <h3 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
            {editingCategory ? editingCategory.name : 'Add a category'}
          </h3>
        </div>

        {/* Modal body */}
        <div style={{ padding: '20px 24px', maxHeight: '65vh', overflowY: 'auto' }}>
          <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
            <div style={sectionGap}>

              {/* Name */}
              <div>
                <ModalLabel>Category Name <span style={{ color: '#ef4444' }}>*</span></ModalLabel>
                <Form.Item name="name" noStyle rules={[{ required: true, message: 'Category name is required' }]}>
                  <Input style={inputSt} placeholder="e.g. Paintings" />
                </Form.Item>
              </div>

              {/* Description */}
              <div>
                <ModalLabel>Description</ModalLabel>
                <Form.Item name="description" noStyle>
                  <Input.TextArea
                    rows={3}
                    placeholder="Briefly describe this category…"
                    style={{ borderRadius: 8, fontSize: '.84rem', resize: 'none' }}
                  />
                </Form.Item>
              </div>

              {/* Image upload */}
              <div>
                <ModalLabel>Category Image</ModalLabel>
                <Upload
                  beforeUpload={handleBeforeUpload}
                  customRequest={handleCustomUpload}
                  fileList={fileList}
                  onChange={({ fileList: fl }) => setFileList(fl)}
                  maxCount={1}
                  listType="picture"
                  accept="image/*"
                >
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      height: 38, padding: '0 14px', borderRadius: 8,
                      border: '1px solid #e2e8f0', background: '#f8fafc',
                      color: '#374151', fontSize: '.82rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <UploadOutlined style={{ fontSize: 14 }} /> Select image
                  </button>
                </Upload>
              </div>

              {/* Attributes */}
              <div style={{ ...divider, paddingTop: 16 }}>
                <p style={{ margin: '0 0 12px', fontSize: '.82rem', fontWeight: 700, color: '#111827' }}>
                  Linked Attributes
                </p>
                <Form.List name="attributes">
                  {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {fields.map(({ key, name }) => (
                        <div
                          key={key}
                          style={{
                            display: 'grid', gridTemplateColumns: '1fr 110px 32px',
                            gap: 8, alignItems: 'flex-end',
                            padding: '12px 14px', borderRadius: 10,
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                          }}
                        >
                          <div>
                            <span style={{ ...label, marginBottom: 4 }}>Attribute</span>
                            <Form.Item name={[name, 'attributeId']} noStyle rules={[{ required: true, message: 'Required' }]}>
                              <Select
                                placeholder="Select attribute"
                                style={{ width: '100%' }}
                              >
                                {globalAttributes.map((a) => (
                                  <Option key={a._id} value={a._id}>{a.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div>
                            <span style={{ ...label, marginBottom: 4 }}>Required</span>
                            <Form.Item name={[name, 'isRequired']} noStyle>
                              <Select style={{ width: '100%' }}>
                                <Option value={true}>Yes</Option>
                                <Option value={false}>No</Option>
                              </Select>
                            </Form.Item>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(name)}
                            style={{
                              width: 32, height: 32, borderRadius: 6, border: '1px solid #fecaca',
                              background: '#fff', color: '#ef4444', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <DeleteOutlined style={{ fontSize: 13 }} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => add()}
                        style={{
                          width: '100%', height: 38, borderRadius: 8,
                          border: '1px dashed #d1d5db', background: '#fafafa',
                          color: '#6b7280', fontSize: '.82rem', cursor: 'pointer',
                          fontFamily: 'inherit', transition: 'all .15s',
                        }}
                      >
                        + Add Attribute
                      </button>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>

            {/* Footer actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <GhostBtn onClick={() => { setIsModalOpen(false); setEditingCategory(null); form.resetFields(); setFileList([]); }}>
                Cancel
              </GhostBtn>
              <PrimaryBtn type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editingCategory ? 'Save Changes' : 'Create Category'}
              </PrimaryBtn>
            </div>
          </Form>
        </div>
      </Modal>

      {/* ── Subcategory Modal ────────────────────────────────────────── */}
      <Modal
        title={null}
        open={isSubModalOpen}
        onCancel={() => { setIsSubModalOpen(false); subForm.resetFields(); }}
        footer={null}
        width={580}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Subcategories
          </p>
          <h3 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
            {selectedCategoryForSub?.name}
          </h3>
        </div>

        <div style={{ padding: '20px 24px', maxHeight: '70vh', overflowY: 'auto' }}>

          {/* Add subcategory form */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
            <p style={{ margin: '0 0 14px', fontSize: '.82rem', fontWeight: 700, color: '#111827' }}>Add Subcategory</p>
            <Form form={subForm} layout="vertical" onFinish={handleCreateSubcategory}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <ModalLabel>Name <span style={{ color: '#ef4444' }}>*</span></ModalLabel>
                  <Form.Item name="name" noStyle rules={[{ required: true, message: 'Required' }]}>
                    <Input style={inputSt} placeholder="e.g. Oil Paintings" />
                  </Form.Item>
                </div>
                <div>
                  <ModalLabel>Description</ModalLabel>
                  <Form.Item name="description" noStyle>
                    <Input style={inputSt} placeholder="Optional" />
                  </Form.Item>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <PrimaryBtn type="submit" disabled={subSubmitting} style={{ height: 36, fontSize: '.82rem' }}>
                  {subSubmitting ? 'Adding…' : '+ Add'}
                </PrimaryBtn>
              </div>
            </Form>
          </div>

          {/* Existing subcategories list */}
          <p style={{ margin: '0 0 10px', fontSize: '.78rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Existing ({subcategories.length})
          </p>
          {subcategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#9ca3af', fontSize: '.84rem' }}>
              No subcategories yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subcategories.map((sub, i) => (
                <div
                  key={sub._id || i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10,
                    border: '1px solid #e2e8f0', background: '#fff',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '.84rem', fontWeight: 600, color: '#111827' }}>{sub.name}</p>
                    {sub.description && (
                      <p style={{ margin: '2px 0 0', fontSize: '.75rem', color: '#6b7280' }}>{sub.description}</p>
                    )}
                  </div>
                  <span style={{
                    padding: '2px 10px', borderRadius: 20,
                    background: '#f1f5f9', fontSize: '.72rem', fontWeight: 600, color: '#64748b',
                  }}>
                    Sub
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
          <GhostBtn onClick={() => { setIsSubModalOpen(false); subForm.resetFields(); }}>Close</GhostBtn>
        </div>
      </Modal>
    </AllCategoriesWrapper>
  );
}

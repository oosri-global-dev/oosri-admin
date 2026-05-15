import { useState, useEffect } from "react";
import { Table, Avatar, Popover, Modal, Form, Input, Upload, Select, message } from "antd";
import { IoSearchOutline as SearchIcon } from "react-icons/io5";
import { HiOutlineEllipsisHorizontal as EllipsisIcon } from "react-icons/hi2";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { AllCategoriesWrapper } from "./all-categories.styles";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  createSubcategory, getSubcategories,
} from "@/network/category";
import { getAttributes } from "@/network/attribute";
import { uploadToCloudinary } from "@/network/upload";

const { Option } = Select;

export default function AllCategoriesScreen() {
  const [categories,              setCategories]              = useState([]);
  const [loading,                 setLoading]                 = useState(false);
  const [isSubmitting,            setIsSubmitting]            = useState(false);
  const [searchTerm,              setSearchTerm]              = useState("");
  const [isModalOpen,             setIsModalOpen]             = useState(false);
  const [isSubModalOpen,          setIsSubModalOpen]          = useState(false);
  const [editingCategory,         setEditingCategory]         = useState(null);
  const [selectedCategoryForSub,  setSelectedCategoryForSub]  = useState(null);
  const [subcategories,           setSubcategories]           = useState([]);
  const [form]    = Form.useForm();
  const [subForm] = Form.useForm();
  const [fileList,          setFileList]          = useState([]);
  const [globalAttributes,  setGlobalAttributes]  = useState([]);

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

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Category deleted");
      fetchCategories();
    } catch {
      message.error("Failed to delete category");
    }
  };

  const handleManageSubs = async (record) => {
    setSelectedCategoryForSub(record);
    setSubcategories(record.subcategories || []);
    setIsSubModalOpen(true);
  };

  const handleCreateSubcategory = async (values) => {
    try {
      await createSubcategory({ ...values, categoryId: selectedCategoryForSub._id });
      message.success("Subcategory created");
      subForm.resetFields();
      fetchCategories();
      const res = await getSubcategories(selectedCategoryForSub._id);
      setSubcategories(res.data.data);
    } catch {
      message.error("Failed to create subcategory");
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
    if (!ok)            { message.error("JPG/PNG/GIF only"); return Upload.LIST_IGNORE; }
    if (file.size / 1024 / 1024 > 5) { message.error("Max 5 MB"); return Upload.LIST_IGNORE; }
    return true;
  };

  const ActionMenu = ({ record }) => (
    <div className="action__menu">
      <button onClick={() => openEdit(record)}>Edit</button>
      <button onClick={() => handleManageSubs(record)}>Subcategories</button>
      <button className="danger" onClick={() => handleDelete(record._id)}>Delete</button>
    </div>
  );

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
      render: (subs) => (
        <span className="sub__count">{subs?.length || 0}</span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 48,
      render: (_, record) => (
        <Popover content={<ActionMenu record={record} />} trigger="click" placement="bottomRight">
          <EllipsisIcon size={18} style={{ cursor: "pointer", color: "#9ca3af" }} />
        </Popover>
      ),
    },
  ];

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

      {/* Create / Edit Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate} style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Category name required" }]}>
            <Input style={{ height: 40 }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={handleBeforeUpload}
              customRequest={handleCustomUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
              listType="picture"
            >
              <button type="button" className="upload__btn">
                <UploadOutlined /> Select Image
              </button>
            </Upload>
          </Form.Item>

          <p className="attr__heading">Link Attributes</p>
          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <div key={key} className="attr__row">
                    <Form.Item {...rest} name={[name, "attributeId"]} label="Attribute" rules={[{ required: true, message: "Required" }]} style={{ flex: 1, marginBottom: 0 }}>
                      <Select placeholder="Select attribute" style={{ width: "100%" }}>
                        {globalAttributes.map((a) => <Option key={a._id} value={a._id}>{a.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item {...rest} name={[name, "isRequired"]} label="Required" style={{ width: 110, marginBottom: 0 }}>
                      <Select>
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
                      </Select>
                    </Form.Item>
                    <button type="button" className="remove__attr__btn" onClick={() => remove(name)}>Remove</button>
                  </div>
                ))}
                <Form.Item>
                  <button type="button" className="add__attr__btn" onClick={() => add()}>+ Add Attribute</button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginBottom: 0 }}>
            <button type="submit" className="submit__btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : editingCategory ? "Update" : "Create"}
            </button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={`Subcategories — ${selectedCategoryForSub?.name}`}
        open={isSubModalOpen}
        onCancel={() => setIsSubModalOpen(false)}
        footer={null}
        width={640}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        <Form form={subForm} layout="vertical" onFinish={handleCreateSubcategory} style={{ marginBottom: 20 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
            <Input style={{ height: 40 }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input style={{ height: 40 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <button type="submit" className="submit__btn">Add Subcategory</button>
          </Form.Item>
        </Form>

        <Table
          dataSource={subcategories}
          rowKey="_id"
          pagination={false}
          columns={[
            { title: "Name",        dataIndex: "name"        },
            { title: "Description", dataIndex: "description", render: (v) => v || "—" },
          ]}
        />
      </Modal>
    </AllCategoriesWrapper>
  );
}

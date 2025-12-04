import { formInstance, instance } from './axios';

export const getCategories = async () => {
    const data = await instance.get('/categories');
    return data;
};

export const getCategory = async (id) => {
    const data = await instance.get(`/categories/${id}`);
    return data;
};

export const createCategory = async (payload) => {
    const data = await formInstance.post('/categories', payload);
    return data;
};

export const updateCategory = async (id, payload, isForm = false) => {

    const client = isForm ? formInstance : instance;
    return client.put(`/categories/${id}`, payload);
};

export const deleteCategory = async (id) => {
    const data = await instance.delete(`/categories/${id}`);
    return data;
};

export const createSubcategory = async (payload) => {
    const data = await instance.post('/categories/subcategory', payload);
    return data;
};

export const getSubcategories = async (categoryId) => {
    const data = await instance.get(`/categories/${categoryId}/subcategory`);
    return data;
};

export const updateSubcategory = async (categoryId, id, payload) => {
    const data = await instance.put(`/categories/${categoryId}/subcategory/${id}`, payload);
    return data;
};

import { instance } from './axios';

export const getAttributes = async (type) => {
    const data = await instance.get('/attributes', { params: { type } });
    return data;
};

export const getAttribute = async (id) => {
    const data = await instance.get(`/attributes/${id}`);
    return data;
};

export const createAttribute = async (payload) => {
    const data = await instance.post('/attributes', payload);
    return data;
};

export const updateAttribute = async (id, payload) => {
    const data = await instance.put(`/attributes/${id}`, payload);
    return data;
};

export const deleteAttribute = async (id) => {
    const data = await instance.delete(`/attributes/${id}`);
    return data;
};

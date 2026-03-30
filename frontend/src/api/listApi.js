import api from './axiosInstance';

export const createList = async (data) => {
    return await api.post('/api/lists', data);
};

export const deleteList = async (listId) => {
    return await api.delete(`/api/lists/${listId}`);
};

export const updateList = async (listId, data) => {
    return await api.patch(`/api/lists/${listId}`, data);
};

export const reorderLists = async (data) => {
    return await api.patch('/api/lists/reorder', data);
};
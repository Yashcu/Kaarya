import api from './axiosInstance';

export const createList = async (data) => {
    const response = await api.post('/api/lists', data);
    return response.data;
};

export const deleteList = async (listId) => {
    const response = await api.delete(`/api/lists/${listId}`);
    return response.message;
};

export const updateList = async (listId, data) => {
    const response = await api.patch(`/api/lists/${listId}`, data);
    return response.data;
};

export const reorderLists = async (data) => {
    const response = await api.patch('/api/lists/reorder', data);
    return response.message;
};

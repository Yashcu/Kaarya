import api from './axiosInstance';

export const createBoard = async (data) => {
    const response = await api.post('/api/boards', data);
    return response.data;
};

export const deleteBoard = async (id) => {
    const response = await api.delete(`/api/boards/${id}`);
    return response.message;
};

export const getBoardById = async (id) => {
    const response = await api.get(`/api/boards/${id}`);
    return response.data;
};

export const updateBoard = async (id, data) => {
    const response = await api.patch(`/api/boards/${id}`, data);
    return response.data;
};

export const getAllBoards = async () => {
    const response = await api.get('/api/boards');
    return response.data;
};

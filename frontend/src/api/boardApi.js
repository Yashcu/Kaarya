import api from './axiosInstance';

export const createBoard = async (data) => {
    return await api.post('/api/boards', data);
};

export const deleteBoard = async (id) => {
    return await api.delete(`/api/boards/${id}`);
};

export const getBoardById = async (id) => {
    return await api.get(`/api/boards/${id}`);
};

export const updateBoard = async (id, data) => {
    return await api.patch(`/api/boards/${id}`, data);
};

export const getAllBoards = async () => {
    return await api.get('/api/boards');
};
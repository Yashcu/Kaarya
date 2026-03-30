import api from './axiosInstance';

export const getAllMembers = async () => {
    const response = await api.get('/api/cards/members');
    return response.data;
};

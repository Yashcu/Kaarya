import api from './axiosInstance';

export const getAllMembers = async () => {
    return await api.get('/api/cards/members');
};

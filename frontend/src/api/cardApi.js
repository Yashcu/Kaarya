import api from './axiosInstance';

export const createCard = async (data) => {
    return await api.post('/api/cards', data);
};

export const updateCard = async (cardId, data) => {
    return await api.patch(`/api/cards/${cardId}`, data);
};

export const deleteCard = async (cardId) => {
    return await api.delete(`/api/cards/${cardId}`);
};

export const moveCard = async (data) => {
    return await api.patch('/api/cards/move', data);
};

export const createLabelForCard = async (cardId, data) => {
    return await api.post(`/api/cards/${cardId}/labels`, data);
};

export const removeLabelFromCard = async (cardId, labelId) => {
    return await api.delete(`/api/cards/${cardId}/labels/${labelId}`);
};

export const addMemberToCard = async (cardId, data) => {
    return await api.post(`/api/cards/${cardId}/members`, data);
};

export const removeMemberFromCard = async (cardId, memberId) => {
    return await api.delete(`/api/cards/${cardId}/members/${memberId}`);
};

export const createChecklist = async (cardId, data) => {
    return await api.post(`/api/cards/${cardId}/checklists`, data);
};

export const addChecklistItem = async (data) => {
    return await api.post('/api/cards/checklists/items', data);
};

export const updateChecklistItem = async (itemId, data) => {
    return await api.patch(`/api/cards/checklists/items/${itemId}`, data);
};

export const deleteChecklistItem = async (itemId) => {
    return await api.delete(`/api/cards/checklists/items/${itemId}`);
};

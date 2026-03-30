import api from './axiosInstance';

export const createCard = async (data) => {
    const response = await api.post('/api/cards', data);
    return response.data;
};

export const updateCard = async (cardId, data) => {
    const response = await api.patch(`/api/cards/${cardId}`, data);
    return response.data;
};

export const deleteCard = async (cardId) => {
    const response = await api.delete(`/api/cards/${cardId}`);
    return response.message;
};

export const moveCard = async (data) => {
    const response = await api.patch('/api/cards/move', data);
    return response.message;
};

export const createLabelForCard = async (cardId, data) => {
    const response = await api.post(`/api/cards/${cardId}/labels`, data);
    return response.data.label;
};

export const removeLabelFromCard = async (cardId, labelId) => {
    const response = await api.delete(`/api/cards/${cardId}/labels/${labelId}`);
    return response.message;
};

export const addMemberToCard = async (cardId, data) => {
    const response = await api.post(`/api/cards/${cardId}/members`, data);
    return response.data;
};

export const removeMemberFromCard = async (cardId, memberId) => {
    const response = await api.delete(`/api/cards/${cardId}/members/${memberId}`);
    return response.message;
};

export const createChecklist = async (cardId, data) => {
    const response = await api.post(`/api/cards/${cardId}/checklists`, data);
    return response.data;
};

export const deleteChecklist = async (cardId, checklistId) => {
    const response = await api.delete(`/api/cards/${cardId}/checklists`, {
        data: { checklistId },
    });
    return response.message;
};

export const addChecklistItem = async (data) => {
    const response = await api.post('/api/cards/checklists/items', data);
    return response.data;
};

export const updateChecklistItem = async (itemId, data) => {
    const response = await api.patch(`/api/cards/checklists/items/${itemId}`, data);
    return response.data;
};

export const deleteChecklistItem = async (itemId) => {
    const response = await api.delete(`/api/cards/checklists/items/${itemId}`);
    return response.message;
};

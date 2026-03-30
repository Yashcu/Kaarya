const prisma = require('../../lib/prisma');
const { invalidateCardAndBoardCache } = require('./cardCacheService');

async function findActiveCardOrThrow(cardId) {
    const card = await prisma.card.findFirst({
        where: { id: cardId, isArchived: false },
        select: { id: true },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    return card;
}

async function findActiveChecklistOrThrow(checklistId) {
    const checklist = await prisma.checklist.findFirst({
        where: {
            id: checklistId,
            card: { isArchived: false },
        },
        select: { id: true, cardId: true },
    });

    if (!checklist) {
        throw { status: 404, message: 'Checklist not found' };
    }

    return checklist;
}

async function findActiveChecklistItemOrThrow(itemId) {
    const checklistItem = await prisma.checklistItem.findFirst({
        where: {
            id: itemId,
            checklist: {
                card: { isArchived: false },
            },
        },
        select: {
            id: true,
            checklist: {
                select: {
                    cardId: true,
                },
            },
        },
    });

    if (!checklistItem) {
        throw { status: 404, message: 'Checklist item not found' };
    }

    return checklistItem;
}

async function createChecklist(cardId, title) {
    await findActiveCardOrThrow(cardId);

    const checklist = await prisma.checklist.create({
        data: {
            title,
            cardId,
        },
    });

    await invalidateCardAndBoardCache(cardId);

    return checklist;
}

async function deleteChecklist(checklistId) {
    const checklist = await findActiveChecklistOrThrow(checklistId);

    await prisma.checklist.delete({
        where: { id: checklistId },
    });

    await invalidateCardAndBoardCache(checklist.cardId);

    return { message: 'Checklist deleted' };
}

async function addChecklistItem(text, checklistId) {
    const checklist = await findActiveChecklistOrThrow(checklistId);

    const item = await prisma.checklistItem.create({
        data: {
            text,
            checklistId,
        },
    });

    await invalidateCardAndBoardCache(checklist.cardId);

    return item;
}

async function updateChecklistItem(itemId, data) {
    const checklistItem = await findActiveChecklistItemOrThrow(itemId);

    const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data,
    });

    await invalidateCardAndBoardCache(checklistItem.checklist.cardId);

    return item;
}

async function deleteChecklistItem(itemId) {
    const checklistItem = await findActiveChecklistItemOrThrow(itemId);

    await prisma.checklistItem.delete({
        where: { id: itemId },
    });

    await invalidateCardAndBoardCache(checklistItem.checklist.cardId);

    return { message: 'Checklist item deleted' };
}

module.exports = {
    createChecklist,
    deleteChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
};

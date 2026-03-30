const prisma = require('../lib/prisma');

async function getCardById(id) {
    return prisma.card.findUnique({
        where: { id },
        include: {
            labels: {
                orderBy: { name: 'asc' },
            },
            members: {
                include: {
                    member: true,
                },
            },
            checklists: {
                include: { items: true },
            },
        },
    });
}

async function getAllMembers() {
    return prisma.member.findMany({
        orderBy: { name: 'asc' },
    });
}

async function createCard({ title, listId }) {
    const last = await prisma.card.aggregate({
        where: { listId },
        _max: { position: true },
    });

    return prisma.card.create({
        data: {
            title,
            listId,
            position: (last._max.position || 0) + 1,
        },
    });
}

async function updateCard(id, data) {
    return prisma.card.update({
        where: { id },
        data,
    });
}

async function deleteCard(id) {
    return prisma.card.update({
        where: { id },
        data: { isArchived: true },
    });
}

async function reorderCards({ cardId, newListId, newPosition }) {
    const card = await prisma.card.findUnique({
        where: { id: cardId },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    const oldListId = card.listId;
    const oldPosition = card.position;

    await prisma.$transaction(async (tx) => {
        await tx.card.update({
            where: { id: cardId },
            data: { position: -1 },
        });

        if (oldListId === newListId) {
            if (newPosition > oldPosition) {
                const affected = await tx.card.findMany({
                    where: {
                        listId: oldListId,
                        position: { gt: oldPosition, lte: newPosition },
                    },
                    orderBy: { position: 'asc' },
                });

                for (const item of affected) {
                    await tx.card.update({
                        where: { id: item.id },
                        data: { position: item.position - 1 },
                    });
                }
            } else {
                const affected = await tx.card.findMany({
                    where: {
                        listId: oldListId,
                        position: { gte: newPosition, lt: oldPosition },
                    },
                    orderBy: { position: 'desc' },
                });

                for (const item of affected) {
                    await tx.card.update({
                        where: { id: item.id },
                        data: { position: item.position + 1 },
                    });
                }
            }
        } else {
            const oldListAffected = await tx.card.findMany({
                where: {
                    listId: oldListId,
                    position: { gt: oldPosition },
                },
                orderBy: { position: 'asc' },
            });

            for (const item of oldListAffected) {
                await tx.card.update({
                    where: { id: item.id },
                    data: { position: item.position - 1 },
                });
            }

            const newListAffected = await tx.card.findMany({
                where: {
                    listId: newListId,
                    position: { gte: newPosition },
                },
                orderBy: { position: 'desc' },
            });

            for (const item of newListAffected) {
                await tx.card.update({
                    where: { id: item.id },
                    data: { position: item.position + 1 },
                });
            }
        }

        await tx.card.update({
            where: { id: cardId },
            data: {
                listId: newListId,
                position: newPosition,
            },
        });
    });

    return { message: 'Card moved successfully' };
}

async function createLabelForCard(cardId, { name, color }) {
    const card = await prisma.card.findUnique({
        where: { id: cardId },
        select: { id: true },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    return prisma.label.create({
        data: {
            name,
            color,
            cardId,
        },
    });
}

async function addMemberToCard(cardId, memberId) {
    const card = await prisma.card.findUnique({
        where: { id: cardId },
        select: { id: true },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    return prisma.cardMember.upsert({
        where: {
            cardId_memberId: {
                cardId,
                memberId,
            },
        },
        update: {},
        create: {
            cardId,
            memberId,
        },
        include: {
            member: true,
        },
    });
}

async function removeMemberFromCard(cardId, memberId) {
    const deleted = await prisma.cardMember.deleteMany({
        where: {
            cardId,
            memberId,
        },
    });

    if (deleted.count === 0) {
        throw { status: 404, message: 'Member not assigned to card' };
    }

    return { message: 'Member removed from card' };
}

async function removeLabelFromCard(cardId, labelId) {
    const deleted = await prisma.label.deleteMany({
        where: {
            id: labelId,
            cardId,
        },
    });

    if (deleted.count === 0) {
        throw { status: 404, message: 'Label not found on card' };
    }

    return { message: 'Label removed from card' };
}

async function createChecklist(cardId, title) {
    return prisma.checklist.create({
        data: {
            title,
            cardId,
        },
    });
}

async function addChecklistItem(text, checklistId) {
    return prisma.checklistItem.create({
        data: {
            text,
            checklistId,
        },
    });
}

async function updateChecklistItem(itemId, data) {
    return prisma.checklistItem.update({
        where: { id: itemId },
        data,
    });
}

async function deleteChecklistItem(itemId) {
    return prisma.checklistItem.delete({
        where: { id: itemId },
    });
}

module.exports = {
    getCardById,
    getAllMembers,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
    createLabelForCard,
    addMemberToCard,
    removeMemberFromCard,
    removeLabelFromCard,
    createChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
};

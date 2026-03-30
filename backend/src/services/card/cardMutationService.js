const prisma = require('../../lib/prisma');
const { moveIdToPosition, resequenceRows } = require('../orderingHelpers');
const { invalidateCardAndBoardCache } = require('./cardCacheService');

async function findActiveCardOrThrow(id) {
    const card = await prisma.card.findFirst({
        where: { id, isArchived: false },
        select: { id: true },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    return card;
}

async function createCard({ title, listId }) {
    const last = await prisma.card.aggregate({
        where: { listId, isArchived: false },
        _max: { position: true },
    });

    const newCard = await prisma.card.create({
        data: {
            title,
            listId,
            position: (last._max.position || 0) + 1,
        },
    });

    await invalidateCardAndBoardCache(newCard.id);

    return newCard;
}

async function updateCard(id, data) {
    await findActiveCardOrThrow(id);

    const updated = await prisma.card.update({
        where: { id },
        data,
    });

    await invalidateCardAndBoardCache(id);

    return updated;
}

async function deleteCard(id) {
    await findActiveCardOrThrow(id);

    const result = await prisma.card.update({
        where: { id },
        data: { isArchived: true },
    });

    await invalidateCardAndBoardCache(id);

    return result;
}

async function reorderCards({ cardId, newListId, newPosition }) {
    const card = await prisma.card.findFirst({
        where: { id: cardId, isArchived: false },
    });

    if (!card) {
        throw { status: 404, message: 'Card not found' };
    }

    const [sourceList, destinationList] = await Promise.all([
        prisma.list.findFirst({
            where: { id: card.listId, isArchived: false },
            select: { id: true },
        }),
        prisma.list.findFirst({
            where: { id: newListId, isArchived: false },
            select: { id: true },
        }),
    ]);

    if (!sourceList || !destinationList) {
        throw { status: 404, message: 'List not found' };
    }

    const [sourceCards, destinationCards] = await Promise.all([
        prisma.card.findMany({
            where: { listId: card.listId, isArchived: false },
            orderBy: { position: 'asc' },
            select: { id: true, position: true },
        }),
        card.listId === newListId
            ? Promise.resolve([])
            : prisma.card.findMany({
                  where: { listId: newListId, isArchived: false },
                  orderBy: { position: 'asc' },
                  select: { id: true, position: true },
              }),
    ]);

    const sourceIds = sourceCards.map((item) => item.id);
    const isSameList = card.listId === newListId;
    const finalSourceIds = isSameList
        ? moveIdToPosition(sourceIds, cardId, newPosition)
        : sourceIds.filter((id) => id !== cardId);
    const finalDestinationIds = isSameList
        ? finalSourceIds
        : moveIdToPosition(
              destinationCards.map((item) => item.id),
              cardId,
              newPosition
          );
    const sourceTempBase =
        sourceCards.reduce((max, item) => Math.max(max, item.position), 0) + 1000;
    const destinationTempBase = isSameList
        ? sourceTempBase
        : destinationCards.reduce((max, item) => Math.max(max, item.position), 0) + 1000;

    if (isSameList && sourceIds.every((id, index) => id === finalSourceIds[index])) {
        return { message: 'Card moved successfully' };
    }

    await prisma.$transaction(async (tx) => {
        if (!isSameList) {
            await tx.card.update({
                where: { id: cardId },
                data: {
                    listId: newListId,
                    position: 0,
                },
            });
        }

        if (isSameList) {
            await tx.card.update({
                where: { id: cardId },
                data: { position: 0 },
            });

            await resequenceRows(tx, 'card', finalSourceIds, sourceTempBase);
        } else {
            await resequenceRows(tx, 'card', finalSourceIds, sourceTempBase);
            await resequenceRows(tx, 'card', finalDestinationIds, destinationTempBase);
        }
    });

    await invalidateCardAndBoardCache(cardId);

    return { message: 'Card moved successfully' };
}

module.exports = {
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
};

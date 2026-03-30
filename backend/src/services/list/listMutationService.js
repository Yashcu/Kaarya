const prisma = require('../../lib/prisma');
const { moveIdToPosition, resequenceRows } = require('../orderingHelpers');
const { invalidateBoardCache } = require('../board/boardCacheService');

async function createList({ title, boardId }) {
    const last = await prisma.list.aggregate({
        where: { boardId, isArchived: false },
        _max: { position: true },
    });

    const newList = await prisma.list.create({
        data: {
            title,
            boardId,
            position: (last._max.position || 0) + 1,
        },
    });

    await invalidateBoardCache(boardId);

    return newList;
}

async function updateList(id, data) {
    const list = await prisma.list.update({
        where: { id },
        data,
    });

    await invalidateBoardCache(list.boardId);

    return list;
}

async function deleteList(id) {
    const list = await prisma.list.update({
        where: { id },
        data: { isArchived: true },
    });

    await invalidateBoardCache(list.boardId);

    return list;
}

async function reorderLists({ listId, newPosition }) {
    const list = await prisma.list.findFirst({
        where: { id: listId, isArchived: false },
    });

    if (!list) {
        throw { status: 404, message: 'List not found' };
    }

    const activeLists = await prisma.list.findMany({
        where: { boardId: list.boardId, isArchived: false },
        orderBy: { position: 'asc' },
        select: { id: true, position: true },
    });

    const currentIds = activeLists.map((item) => item.id);
    const finalIds = moveIdToPosition(currentIds, listId, newPosition);
    const tempBase =
        activeLists.reduce((max, item) => Math.max(max, item.position), 0) + 1000;

    if (currentIds.every((id, index) => id === finalIds[index])) {
        return { message: 'List reordered' };
    }

    await prisma.$transaction(async (tx) => {
        await tx.list.update({
            where: { id: listId },
            data: { position: 0 },
        });

        await resequenceRows(tx, 'list', finalIds, tempBase);
    });

    await invalidateBoardCache(list.boardId);

    return { message: 'List reordered' };
}

module.exports = {
    createList,
    updateList,
    deleteList,
    reorderLists,
};

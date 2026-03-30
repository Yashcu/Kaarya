const prisma = require('../lib/prisma');

async function createList({ title, boardId }) {
    const last = await prisma.list.aggregate({
        where: { boardId },
        _max: { position: true },
    });

    return prisma.list.create({
        data: {
            title,
            boardId,
            position: (last._max.position || 0) + 1,
        },
    });
}

async function updateList(id, data) {
    return prisma.list.update({
        where: { id },
        data,
    });
}

async function deleteList(id) {
    return prisma.list.update({
        where: { id },
        data: { isArchived: true },
    });
}

async function reorderLists({ listId, newPosition }) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
    });

    if (!list) {
        throw { status: 404, message: 'List not found' };
    }

    const oldPosition = list.position;

    if (newPosition === oldPosition) {
        return { message: 'List reordered' };
    }

    await prisma.$transaction(async (tx) => {
        await tx.list.update({
            where: { id: listId },
            data: { position: -1 },
        });

        if (newPosition > oldPosition) {
            const affected = await tx.list.findMany({
                where: {
                    boardId: list.boardId,
                    position: { gt: oldPosition, lte: newPosition },
                },
                orderBy: { position: 'asc' },
            });

            for (const item of affected) {
                await tx.list.update({
                    where: { id: item.id },
                    data: { position: item.position - 1 },
                });
            }
        } else {
            const affected = await tx.list.findMany({
                where: {
                    boardId: list.boardId,
                    position: { gte: newPosition, lt: oldPosition },
                },
                orderBy: { position: 'desc' },
            });

            for (const item of affected) {
                await tx.list.update({
                    where: { id: item.id },
                    data: { position: item.position + 1 },
                });
            }
        }

        await tx.list.update({
            where: { id: listId },
            data: { position: newPosition },
        });
    });

    return { message: 'List reordered' };
}

module.exports = {
    createList,
    updateList,
    deleteList,
    reorderLists,
};

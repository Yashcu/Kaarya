const prisma = require('../../lib/prisma');
const {
    invalidateBoardCache,
    invalidateBoardsListCache,
} = require('./boardCacheService');

async function createBoard(data) {
    invalidateBoardsListCache();
    return prisma.board.create({ data });
}

async function updateBoard(id, data) {
    const board = await prisma.board.update({
        where: { id },
        data,
    });

    invalidateBoardsListCache();
    await invalidateBoardCache(id);

    return board;
}

async function deleteBoard(id) {
    const result = await prisma.board.update({
        where: { id },
        data: { isArchived: true },
    });

    invalidateBoardsListCache();
    await invalidateBoardCache(id);

    return result;
}

module.exports = {
    createBoard,
    updateBoard,
    deleteBoard,
};

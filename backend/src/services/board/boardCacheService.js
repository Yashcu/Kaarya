const prisma = require('../../lib/prisma');
const cache = require('../../lib/cache');

const CACHE_TTL = 30; // seconds

function invalidateBoardCache(boardId) {
    if (!boardId) return;

    cache.del(`board:${boardId}`);
}

function invalidateBoardsListCache() {
    cache.del('boards:all');
}

async function getAllBoards() {
    const cacheKey = 'boards:all';

    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const boards = await prisma.board.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: 'desc' },
    });

    cache.set(cacheKey, boards, CACHE_TTL);
    return boards;
}

async function getBoardById(id) {
    const cacheKey = `board:${id}`;

    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const board = await prisma.board.findFirst({
        where: { id, isArchived: false },
        include: {
            lists: {
                where: { isArchived: false },
                orderBy: { position: 'asc' },
                include: {
                    cards: {
                        where: { isArchived: false },
                        orderBy: { position: 'asc' },
                        include: {
                            members: {
                                include: {
                                    member: true,
                                },
                            },
                            labels: {
                                orderBy: { name: 'asc' },
                            },
                            checklists: {
                                include: { items: true },
                            },
                        },
                    },
                },
            },
        },
    });

    if (board) {
        cache.set(cacheKey, board, CACHE_TTL);
    }

    return board;
}

module.exports = {
    getAllBoards,
    getBoardById,
    invalidateBoardCache,
    invalidateBoardsListCache,
};

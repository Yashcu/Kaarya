const prisma = require('../../lib/prisma');
const cache = require('../../lib/cache');

const CACHE_TTL = 30; // seconds

async function invalidateCardAndBoardCache(cardId) {
    if (!cardId) return;

    cache.del(`card:${cardId}`);

    const card = await prisma.card.findUnique({
        where: { id: cardId },
        select: { listId: true },
    });

    if (!card) return;

    const list = await prisma.list.findUnique({
        where: { id: card.listId },
        select: { boardId: true },
    });

    if (list) {
        cache.del(`board:${list.boardId}`);
    }
}

async function getCardById(id) {
    const cacheKey = `card:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const card = await prisma.card.findFirst({
        where: { id, isArchived: false },
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

    if (card) {
        cache.set(cacheKey, card, CACHE_TTL);
    }

    return card;
}

async function getAllMembers({ limit, offset }) {
    const cacheKey = `members:${offset}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const [members, total] = await Promise.all([
        prisma.member.findMany({
            orderBy: { name: 'asc' },
            skip: offset,
            take: limit,
        }),
        prisma.member.count(),
    ]);

    const result = { members, total };
    cache.set(cacheKey, result, CACHE_TTL);
    return result;
}

module.exports = {
    invalidateCardAndBoardCache,
    getCardById,
    getAllMembers,
};

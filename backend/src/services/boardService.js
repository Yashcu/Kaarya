const prisma = require('../lib/prisma');

async function getAllBoards() {
    return prisma.board.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: 'desc' },
    });
}

async function getBoardById(id) {
    return prisma.board.findUnique({
        where: { id },
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
}

async function createBoard(data) {
    return prisma.board.create({ data });
}

async function updateBoard(id, data) {
    return prisma.board.update({
        where: { id },
        data,
    });
}

async function deleteBoard(id) {
    return prisma.board.update({
        where: { id },
        data: { isArchived: true },
    });
}

module.exports = {
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
};

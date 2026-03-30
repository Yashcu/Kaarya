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

async function createLabelForCard(cardId, { name, color }) {
    await findActiveCardOrThrow(cardId);

    const label = await prisma.label.create({
        data: {
            name,
            color,
            cardId,
        },
    });

    await invalidateCardAndBoardCache(cardId);

    return label;
}

async function addMemberToCard(cardId, memberId) {
    await findActiveCardOrThrow(cardId);

    const cardMember = await prisma.cardMember.upsert({
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

    await invalidateCardAndBoardCache(cardId);

    return cardMember;
}

async function removeMemberFromCard(cardId, memberId) {
    await findActiveCardOrThrow(cardId);

    const deleted = await prisma.cardMember.deleteMany({
        where: {
            cardId,
            memberId,
        },
    });

    if (deleted.count === 0) {
        throw { status: 404, message: 'Member not assigned to card' };
    }

    await invalidateCardAndBoardCache(cardId);

    return { message: 'Member removed from card' };
}

async function removeLabelFromCard(cardId, labelId) {
    await findActiveCardOrThrow(cardId);

    const deleted = await prisma.label.deleteMany({
        where: {
            id: labelId,
            cardId,
        },
    });

    if (deleted.count === 0) {
        throw { status: 404, message: 'Label not found on card' };
    }

    await invalidateCardAndBoardCache(cardId);

    return { message: 'Label removed from card' };
}

module.exports = {
    createLabelForCard,
    addMemberToCard,
    removeMemberFromCard,
    removeLabelFromCard,
};

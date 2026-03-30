function normalizeCard(card) {
    return {
        ...card,
        labels: card?.labels || [],
        members: card?.members || [],
        checklists: card?.checklists || [],
    };
}

function normalizeList(list) {
    return {
        ...list,
        cards: (list?.cards || []).map(normalizeCard),
    };
}

function collectLabelsFromBoardLists(lists) {
    const labelsById = new Map();

    for (const list of lists) {
        for (const card of list.cards || []) {
            for (const label of card.labels || []) {
                labelsById.set(label.id, label);
            }
        }
    }

    return Array.from(labelsById.values()).sort((left, right) =>
        (left.name || '').localeCompare(right.name || '')
    );
}

export function normalizeBoard(board) {
    if (!board) return null;

    const lists = (board.lists || []).map(normalizeList);

    return {
        ...board,
        lists,
        labels: collectLabelsFromBoardLists(lists),
    };
}

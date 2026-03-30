export const BOARD_DND_STATE_EVENT = 'board-dnd-state';

export function emitBoardDragState(active, clientX = 0) {
    window.dispatchEvent(
        new CustomEvent(BOARD_DND_STATE_EVENT, {
            detail: { active, clientX },
        })
    );
}

export function getListMovePlan({ lists, activeId, overId, placement = 'before' }) {
    const sourceIndex = lists.findIndex((list) => list.id === activeId);
    if (sourceIndex === -1) return null;

    const overIndex = lists.findIndex((list) => list.id === overId);
    if (overIndex === -1 || activeId === overId) return null;

    const finalIndex =
        placement === 'after'
            ? sourceIndex < overIndex
                ? overIndex
                : overIndex + 1
            : sourceIndex < overIndex
                ? overIndex - 1
                : overIndex;

    const newPosition = finalIndex + 1;

    if (sourceIndex === finalIndex) return null;

    return { sourceIndex, finalIndex, newPosition };
}

export function getCardMovePlan({
    sourceCards,
    destCards,
    sourceListId,
    destListId,
    activeId,
    overId,
}) {
    const sourceIndex = sourceCards.findIndex((card) => card.id === activeId);
    if (sourceIndex === -1) return null;

    let finalIndex;
    let newPosition;

    if (!overId) {
        finalIndex =
            destListId === sourceListId ? sourceCards.length - 1 : destCards.length;
        newPosition = finalIndex + 1;
    } else {
        const overIndex = destCards.findIndex((card) => card.id === overId);
        if (overIndex === -1 || (sourceListId === destListId && activeId === overId)) {
            return null;
        }

        finalIndex =
            destListId === sourceListId && sourceIndex < overIndex
                ? overIndex - 1
                : overIndex;

        newPosition = finalIndex + 1;
    }

    if (sourceListId === destListId && sourceIndex === finalIndex) return null;

    return { sourceIndex, finalIndex, newPosition };
}

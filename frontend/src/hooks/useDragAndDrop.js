import useBoardStore from '../store/useBoardStore';
import { getCardMovePlan, getListMovePlan } from '../utils/boardDnd';

function getLists() {
    return useBoardStore.getState().board?.lists || [];
}

function getCards(listId) {
    return getLists().find((list) => list.id === listId)?.cards || [];
}

export function useDragAndDrop({ disabled = false } = {}) {
    const {
        moveListLocal,
        moveCardLocal,
        reorderListsServer,
        moveCardServer,
        refreshBoard,
    } = useBoardStore.getState();

    const syncAfterFailure = async () => {
        const boardId = useBoardStore.getState().board?.id;
        if (boardId) {
            await refreshBoard(boardId);
        }
    };

    const moveList = async ({ activeId, overId }) => {
        if (disabled) return;

        const lists = getLists();
        const plan = getListMovePlan({ lists, activeId, overId });
        if (!plan) return;

        try {
            moveListLocal(activeId, overId);
            await reorderListsServer(activeId, plan.newPosition);
        } catch {
            await syncAfterFailure();
        }
    };

    const moveCard = async ({ activeId, sourceListId, destListId, overId }) => {
        if (disabled) return;

        const sourceCards = getCards(sourceListId);
        const destCards = getCards(destListId);
        const plan = getCardMovePlan({
            sourceCards,
            destCards,
            sourceListId,
            destListId,
            activeId,
            overId,
        });
        if (!plan) return;

        try {
            moveCardLocal(activeId, overId, sourceListId, destListId);
            await moveCardServer({
                cardId: activeId,
                newListId: destListId,
                newPosition: plan.newPosition,
            });
        } catch {
            await syncAfterFailure();
        }
    };

    return {
        disabled,
        moveList,
        moveCard,
    };
}

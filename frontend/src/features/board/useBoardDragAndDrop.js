import { useCallback } from 'react';

import useBoardStore from '../../store/useBoardStore';
import { getCardMovePlan, getListMovePlan } from '../../utils/boardDnd';
import { useToast } from '@/shared/components/ui';

function getLists() {
    return useBoardStore.getState().board?.lists || [];
}

function getCards(listId) {
    return getLists().find((list) => list.id === listId)?.cards || [];
}

/**
 * Hook for drag-and-drop operations with error handling
 */
export function useDragAndDrop({ disabled = false } = {}) {
    const { error: showError } = useToast();
    const {
        moveListLocal,
        moveCardLocal,
        reorderListsServer,
        moveCardServer,
        refreshBoard,
    } = useBoardStore.getState();

    const syncAfterFailure = useCallback(async () => {
        const boardId = useBoardStore.getState().board?.id;
        if (boardId) {
            try {
                await refreshBoard(boardId);
                showError('Something went wrong. Board refreshed.');
            } catch (err) {
                showError('Failed to refresh board. Please reload.');
                console.error('Failed to sync after drag error:', err);
            }
        }
    }, [refreshBoard, showError]);

    const moveList = useCallback(
        async ({ activeId, overId, placement }) => {
            if (disabled) return;

            const lists = getLists();
            const plan = getListMovePlan({ lists, activeId, overId, placement });
            if (!plan) return;

            try {
                moveListLocal(activeId, overId, placement);
                await reorderListsServer(activeId, plan.newPosition);
            } catch (err) {
                console.error('Failed to reorder lists:', err);
                await syncAfterFailure();
            }
        },
        [
            disabled,
            moveListLocal,
            reorderListsServer,
            syncAfterFailure,
        ]
    );

    const moveCard = useCallback(
        async ({ activeId, sourceListId, destListId, overId }) => {
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
            } catch (err) {
                console.error('Failed to move card:', err);
                await syncAfterFailure();
            }
        },
        [
            disabled,
            moveCardLocal,
            moveCardServer,
            syncAfterFailure,
        ]
    );

    return {
        disabled,
        moveList,
        moveCard,
    };
}

import { useRef, useEffect } from 'react';
import invariant from 'tiny-invariant';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { emitBoardDragState } from '../../utils/boardDnd';

/**
 * Hook for making an element draggable and droppable (card-level)
 * Used by CardItem component
 */
export function useCardDragAndDrop({
    card,
    board,
    dndDisabled,
    onDrop,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDrag,
    onDragLeave,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        invariant(element);

        return combine(
            draggable({
                element,
                canDrag: () => !dndDisabled,
                getInitialData: () => ({
                    type: 'card',
                    id: card.id,
                    listId: card.listId
                }),
                onDragStart: ({ location }) => {
                    emitBoardDragState(true, location.current.input.clientX);
                    onDragStart?.();
                },
                onDrop: () => {
                    emitBoardDragState(false);
                    onDragEnd?.();
                },
            }),
            dropTargetForElements({
                element,
                canDrop: ({ source }) =>
                    !dndDisabled &&
                    source.data.type === 'card' &&
                    source.data.id !== card.id,
                getData: ({ input, element }) =>
                    attachClosestEdge(
                        {
                            type: 'card',
                            id: card.id,
                            listId: card.listId,
                        },
                        {
                            element,
                            input,
                            allowedEdges: ['top', 'bottom'],
                        }
                    ),
                onDragEnter: ({ self }) => {
                    const edge = extractClosestEdge(self.data);
                    onDragEnter?.(edge);
                },
                onDrag: ({ self }) => {
                    const edge = extractClosestEdge(self.data);
                    onDrag?.(edge);
                },
                onDragLeave: () => {
                    onDragLeave?.();
                },
                onDrop: async ({ source, self, location }) => {
                    if (location.current.dropTargets[0]?.element !== self.element) {
                        return;
                    }

                    const edge = extractClosestEdge(self.data) || 'top';
                    onDragLeave?.();

                    const list = board?.lists?.find((l) => l.id === card.listId);
                    const cards = list?.cards || [];
                    const currentIndex = cards.findIndex((c) => c.id === card.id);

                    const overId =
                        edge === 'bottom'
                            ? cards[currentIndex + 1]?.id || null
                            : card.id;

                    await onDrop({
                        activeId: source.data.id,
                        sourceListId: source.data.listId,
                        destListId: card.listId,
                        overId,
                    });
                },
            })
        );
    }, [card, board, dndDisabled, onDrop, onDragStart, onDragEnd, onDragEnter, onDrag, onDragLeave]);

    return ref;
}

/**
 * Hook for making a list column draggable and droppable (list-level)
 * Used by ListColumn component
 */
export function useListDragAndDrop({
    list,
    index,
    board,
    dndDisabled,
    onListDrop,
    onCardDrop,
    onDragStart,
    onDragEnd,
    onListDragEnter,
    onListDragLeave,
    onCardsDropEnter,
    onCardsDropLeave,
}) {
    const rootRef = useRef(null);
    const dragHandleRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        const header = dragHandleRef.current;
        const cards = cardsRef.current;

        if (!root || !header || !cards) return undefined;

        return combine(
            draggable({
                element: root,
                dragHandle: header,
                canDrag: () => !dndDisabled,
                getInitialData: () => ({
                    type: 'list',
                    id: list.id,
                    index,
                }),
                onDragStart: ({ location }) => {
                    emitBoardDragState(true, location.current.input.clientX);
                },
                onDrop: () => {
                    emitBoardDragState(false);
                    onDragEnd?.();
                },
            }),
            dropTargetForElements({
                element: root,
                canDrop: ({ source }) =>
                    !dndDisabled &&
                    (source.data.type === 'list' || source.data.type === 'card'),
                getData: ({ input, element }) =>
                    attachClosestEdge(
                        { type: 'list', id: list.id, index },
                        {
                            element,
                            input,
                            allowedEdges: ['left', 'right'],
                        }
                    ),
                onDragStart: ({ source }) => {
                    if (source.data.type === 'list') {
                        onDragStart?.();
                    }
                },
                onDragEnter: () => {
                    onListDragEnter?.();
                },
                onDrag: () => {},
                onDragLeave: () => {
                    onListDragLeave?.();
                },
                onDrop: async ({ source, self, location }) => {
                    if (location.current.dropTargets[0]?.element !== self.element) {
                        return;
                    }

                    if (source.data.type === 'list') {
                        const sourceIndex = board?.lists?.findIndex(
                            (item) => item.id === source.data.id
                        );

                        if (sourceIndex === -1) {
                            return;
                        }

                        await onListDrop({
                            activeId: source.data.id,
                            overId: list.id,
                            placement: sourceIndex < index ? 'after' : 'before',
                        });
                    }

                    if (source.data.type === 'card') {
                        await onCardDrop({
                            activeId: source.data.id,
                            sourceListId: source.data.listId,
                            destListId: list.id,
                            overId: null,
                        });
                    }
                },
            }),
            dropTargetForElements({
                element: cards,
                canDrop: ({ source }) =>
                    !dndDisabled && source.data.type === 'card',
                getData: ({ input, element }) =>
                    attachClosestEdge(
                        {
                            type: 'card-container',
                            listId: list.id,
                            index,
                        },
                        {
                            element,
                            input,
                            allowedEdges: ['top', 'bottom'],
                        }
                    ),
                onDragEnter: () => {
                    onCardsDropEnter?.();
                },
                onDragLeave: () => {
                    onCardsDropLeave?.();
                },
                onDrop: async ({ source, self }) => {
                    const edge = extractClosestEdge(self.data) || 'bottom';
                    const cards = board?.lists?.find((item) => item.id === list.id)?.cards || [];
                    const overId =
                        edge === 'top'
                            ? cards[0]?.id || null
                            : null;

                    await onCardDrop({
                        activeId: source.data.id,
                        sourceListId: source.data.listId,
                        destListId: list.id,
                        overId,
                    });
                },
            })
        );
    }, [
        list,
        index,
        board,
        dndDisabled,
        onListDrop,
        onCardDrop,
        onDragStart,
        onDragEnd,
        onListDragEnter,
        onListDragLeave,
        onCardsDropEnter,
        onCardsDropLeave,
    ]);

    return {
        rootRef,
        dragHandleRef,
        cardsRef,
    };
}

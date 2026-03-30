import React, { useEffect, useRef, useState, useMemo } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import useBoardStore from '../../store/useBoardStore';
import invariant from 'tiny-invariant';
import CardModal from './CardModal';
import { emitBoardDragState } from '../../utils/boardDnd';

function CardItem({ card, dnd, dndDisabled }) {
    const deleteCard = useBoardStore((s) => s.deleteCard);
    const board = useBoardStore((s) => s.board);
    const ref = useRef(null);

    const [state, setState] = useState({ type: 'idle' });
    const [closestEdge, setClosestEdge] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const element = ref.current;
        invariant(element);

        return combine(
            draggable({
                element,
                canDrag: () => !dndDisabled,
                getInitialData: () => ({ type: 'card', id: card.id, listId: card.listId }),
                onDragStart: ({ location }) => {
                    setState({ type: 'dragging' });
                    emitBoardDragState(true, location.current.input.clientX);
                },
                onDrop: () => {
                    setState({ type: 'idle' });
                    emitBoardDragState(false);
                },
            }),
            dropTargetForElements({
                element,
                canDrop: ({ source }) => !dndDisabled && source.data.type === 'card' && source.data.id !== card.id,
                getData: ({ input, element }) =>
                    attachClosestEdge(
                        { type: 'card', id: card.id, listId: card.listId },
                        { element, input, allowedEdges: ['top', 'bottom'] }
                    ),
                onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
                onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
                onDragLeave: () => setClosestEdge(null),
                onDrop: async ({ source, self, location }) => {
                    setClosestEdge(null);

                    if (location.current.dropTargets[0]?.element !== self.element) return;

                    const edge = extractClosestEdge(self.data) || 'top';
                    const list = board?.lists?.find((current) => current.id === card.listId);
                    const cards = list?.cards || [];
                    const currentIndex = cards.findIndex((current) => current.id === card.id);

                    const overId =
                        edge === 'bottom'
                            ? cards[currentIndex + 1]?.id || null
                            : card.id;

                    await dnd.moveCard({
                        activeId: source.data.id,
                        sourceListId: source.data.listId,
                        destListId: card.listId,
                        overId,
                    });
                },
            })
        );
    }, [card, board, dnd, dndDisabled]);

    const isOverdue = useMemo(() => {
        if (!card.dueDate) return false;
        return new Date(card.dueDate) < new Date();
    }, [card.dueDate]);

    return (
        <>
            <div ref={ref} className="relative">
                <div
                    className={`group flex flex-col gap-2 p-3 rounded-lg shadow-sm bg-white border border-transparent hover:border-primary/50 transition-colors ${state.type === 'dragging' ? 'opacity-40' : 'cursor-grab'}`}
                    onClick={() => setShowModal(true)}
                >
                    {/* Labels */}
                    {card.labels?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {card.labels.map((label) => (
                                <span
                                    key={label.id}
                                    className="text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium text-slate-700 flex-1 break-words">
                            {card.title}
                        </p>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteCard(card.id);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Footer */}
                    {(card.dueDate || card.members?.length > 0) && (
                        <div className="flex justify-between items-center mt-1">
                            {card.dueDate && (
                                <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <Calendar className="h-2.5 w-2.5" />
                                    {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            )}

                            {card.members?.length > 0 && (
                                <div className="flex -space-x-1 ml-auto">
                                    {card.members.slice(0, 3).map(cm => (
                                        <div
                                            key={cm.memberId}
                                            className="h-5 w-5 rounded-full border-2 border-white text-white text-[9px] flex items-center justify-center"
                                            style={{ backgroundColor: cm.member?.avatarColor }}
                                        >
                                            {cm.member?.name?.[0]}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
            </div>

            {showModal && <CardModal card={card} onClose={() => setShowModal(false)} />}
        </>
    );
}

export default React.memo(CardItem);

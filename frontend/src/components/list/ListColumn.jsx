import React, { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { GripVertical, Trash2 } from 'lucide-react';
import CardItem from "../card/CardItem";
import useBoardStore from "../../store/useBoardStore";
import InlineEdit from "../shared/InlineEdit";
import { emitBoardDragState } from '../../utils/boardDnd';

const ListColumn = React.memo(({ list, index, dnd, dndDisabled }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [isDraggingList, setIsDraggingList] = useState(false);
    const [isListDropActive, setIsListDropActive] = useState(false);
    const [isCardsDropActive, setIsCardsDropActive] = useState(false);

    const rootRef = useRef(null);
    const dragHandleRef = useRef(null);
    const cardsRef = useRef(null);

    const { addCard, updateListTitle, deleteList } = useBoardStore();

    const handleAddCard = async () => {
        if (!title.trim()) return;

        await addCard(list.id, title);
        setTitle("");
        setIsAdding(false);
    };

    const handleDeleteList = async () => {
        if (!confirm('Delete this list and all its cards?')) return;
        await deleteList(list.id);
    };

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
                getInitialData: () => ({ type: 'list', id: list.id }),
                onDragStart: ({ location }) => {
                    setIsDraggingList(true);
                    emitBoardDragState(true, location.current.input.clientX);
                },
                onDrop: () => {
                    setIsDraggingList(false);
                    emitBoardDragState(false);
                },
            }),
            dropTargetForElements({
                element: root,
                canDrop: ({ source }) =>
                    !dndDisabled && (source.data.type === 'list' || source.data.type === 'card'),
                getData: ({ input, element }) =>
                    attachClosestEdge(
                        { type: 'list', id: list.id, index },
                        { element, input, allowedEdges: ['left', 'right'] }
                    ),
                onDragEnter: () => setIsListDropActive(true),
                onDragLeave: () => setIsListDropActive(false),
                onDrop: async ({ source, self, location }) => {
                    setIsListDropActive(false);

                    if (location.current.dropTargets[0]?.element !== self.element) return;

                    if (source.data.type === 'list') {
                        const edge = extractClosestEdge(self.data) || 'left';
                        const lists = useBoardStore.getState().board?.lists || [];
                        const overId = edge === 'right'
                            ? lists[index + 1]?.id || null
                            : list.id;

                        await dnd.moveList({
                            activeId: source.data.id,
                            overId,
                        });
                    }

                    if (source.data.type === 'card') {
                        await dnd.moveCard({
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
                canDrop: ({ source }) => !dndDisabled && source.data.type === 'card',
                getData: () => ({
                    type: 'card-container',
                    listId: list.id,
                    index,
                }),
                onDragEnter: () => setIsCardsDropActive(true),
                onDragLeave: () => setIsCardsDropActive(false),
                onDrop: async ({ source, self, location }) => {
                    setIsCardsDropActive(false);

                    if (location.current.dropTargets[0]?.element !== self.element) return;

                    await dnd.moveCard({
                        activeId: source.data.id,
                        sourceListId: source.data.listId,
                        destListId: list.id,
                        overId: null,
                    });
                },
            })
        );
    }, [list.id, index, dnd, dndDisabled]);

    return (
        <div
            ref={rootRef}
            className={`group flex h-full w-[85vw] max-w-[22rem] shrink-0 flex-col rounded-xl bg-[#f1f2f4] text-[#172b4d] shadow-sm transition-all sm:w-80 ${isDraggingList ? 'opacity-40' : ''} ${isListDropActive ? 'ring-2 ring-blue-400/70 ring-offset-2 ring-offset-transparent' : ''}`}
        >

            {/* Header */}
            <div className="flex items-start justify-between gap-2 rounded-t-xl px-3 py-3">
                <div className="min-w-0 flex-1">
                    <InlineEdit
                        value={list.title}
                        onSave={(nextTitle) => updateListTitle(list.id, nextTitle)}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleDeleteList}
                    className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    aria-label="Delete list"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
                <button
                    ref={dragHandleRef}
                    type="button"
                    aria-label="Drag list"
                    className="mt-0.5 inline-flex h-6 w-6 cursor-grab items-center justify-center rounded text-slate-400 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>

            {/* Cards */}
            <div
                ref={cardsRef}
                className={`flex-1 min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-2 transition-colors ${isCardsDropActive ? 'bg-blue-50/70' : ''}`}
            >
                {(list.cards?.length || 0) === 0 && (
                    <p className={`text-xs px-2 ${isCardsDropActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        {isCardsDropActive ? 'Drop card here' : 'No cards'}
                    </p>
                )}

                {(list.cards || []).map((card) => (
                    <CardItem
                        key={card.id}
                        card={card}
                        dnd={dnd}
                        dndDisabled={dndDisabled}
                    />
                ))}
            </div>

            {/* Add Card */}
            <div className="p-2">
                {isAdding ? (
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddCard();
                        }}
                    >
                        <input
                            className="p-2 rounded-md text-sm border"
                            placeholder="Enter card title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="text-sm text-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="w-full text-left text-sm font-medium text-[#44546f] hover:bg-[#dcdfe4] p-2 rounded-md"
                    >
                        + Add a card
                    </button>
                )}
            </div>
        </div>
    );
});

export default ListColumn;

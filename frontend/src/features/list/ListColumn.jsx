import { memo, useEffect, useState } from 'react';

import useBoardStore from '../../store/useBoardStore';
import { useListDragAndDrop } from '@/shared/hooks/useElementDragAndDrop';
import { ConfirmDialog, useToast } from '@/shared/components/ui';

import ListHeader from './ListHeader';
import ListCardsArea from './ListCardsArea';
import AddCardForm from './AddCardForm';

/**
 * ListColumn - A single list column with cards and drag/drop support
 */
const ListColumn = memo(function ListColumn({
    list,
    index,
    dnd,
    listDndDisabled,
    cardDndDisabled,
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isDraggingList, setIsDraggingList] = useState(false);
    const [isListDropActive, setIsListDropActive] = useState(false);
    const [isCardsDropActive, setIsCardsDropActive] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const addCard = useBoardStore((state) => state.addCard);
    const updateListTitle = useBoardStore((state) => state.updateListTitle);
    const deleteList = useBoardStore((state) => state.deleteList);
    const board = useBoardStore((state) => state.board);
    const { error: showError } = useToast();

    const handleAddCard = async (title) => {
        if (!title.trim()) return;

        try {
            await addCard(list.id, title);
            setIsAdding(false);
        } catch (err) {
            console.error('Failed to add card:', err);
            showError('Failed to add card. Please try again.');
        }
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    const handleDeleteList = () => {
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteList(list.id);
            setShowDeleteConfirm(false);
        } catch (err) {
            console.error('Failed to delete list:', err);
            showError('Failed to delete list. Please try again.');
        }
    };

    useEffect(() => {
        if (listDndDisabled) {
            setIsDraggingList(false);
            setIsListDropActive(false);
            setIsCardsDropActive(false);
        }
    }, [listDndDisabled]);

    // Use shared hook for drag and drop
    const { rootRef, dragHandleRef, cardsRef } = useListDragAndDrop({
        list,
        index,
        board,
        dndDisabled: listDndDisabled,
        onListDrop: async ({ activeId, overId, placement }) => {
            await dnd.moveList({
                activeId,
                overId,
                placement,
            });
        },
        onCardDrop: async ({ activeId, sourceListId, destListId, overId }) => {
            await dnd.moveCard({
                activeId,
                sourceListId,
                destListId,
                overId,
            });
        },
        onDragStart: () => {
            setIsDraggingList(true);
        },
        onDragEnd: () => {
            setIsDraggingList(false);
            setIsListDropActive(false);
            setIsCardsDropActive(false);
        },
        onListDragEnter: () => {
            setIsListDropActive(true);
        },
        onListDragLeave: () => {
            setIsListDropActive(false);
        },
        onCardsDropEnter: () => {
            setIsCardsDropActive(true);
        },
        onCardsDropLeave: () => {
            setIsCardsDropActive(false);
        },
    });

    const containerClasses = `group flex h-full w-[85vw] max-w-[22rem] shrink-0 flex-col rounded-xl bg-[#f1f2f4] text-[#172b4d] shadow-sm transition-all sm:w-80 ${
        isDraggingList ? 'opacity-40' : ''
    }`;

    return (
        <div ref={rootRef} className={containerClasses}>
            <ListHeader
                listId={list.id}
                title={list.title}
                onUpdateTitle={updateListTitle}
                onDelete={handleDeleteList}
                dndDisabled={listDndDisabled}
                dragHandleRef={dragHandleRef}
            />

            <ListCardsArea
                cards={list.cards || []}
                dnd={dnd}
                dndDisabled={cardDndDisabled}
                isDropActive={isCardsDropActive}
                cardsRef={cardsRef}
            />

            <div className="p-2">
                {isAdding ? (
                    <AddCardForm
                        onAdd={handleAddCard}
                        onCancel={handleCancelAdd}
                    />
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

            <ConfirmDialog
                open={showDeleteConfirm}
                title="Delete list?"
                description={`This will permanently delete "${list.title}" and all of its cards.`}
                confirmLabel="Delete list"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
});

export default ListColumn;

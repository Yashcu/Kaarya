import { memo, useState } from 'react';

import { Button, ConfirmDialog, useToast } from '@/shared/components/ui';
import useBoardStore from '../../store/useBoardStore';
import CardModal from './CardModal';
import CardLabels from './CardLabels';
import CardFooter from './CardFooter';
import { useCardDragAndDrop } from '@/shared/hooks/useElementDragAndDrop';

/**
 * CardItem - Single card component with drag and drop
 */
const CardItem = memo(function CardItem({ card, dnd, dndDisabled }) {
    const [showModal, setShowModal] = useState(false);
    const [closestEdge, setClosestEdge] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const deleteCard = useBoardStore((s) => s.deleteCard);
    const board = useBoardStore((s) => s.board);
    const { error: showError } = useToast();

    // Use the shared hook for drag and drop setup
    const cardRef = useCardDragAndDrop({
        card,
        board,
        dndDisabled,
        onDrop: async ({ activeId, sourceListId, destListId, overId }) => {
            await dnd.moveCard({
                activeId,
                sourceListId,
                destListId,
                overId,
            });
        },
        onDragLeave: () => {
            setClosestEdge(null);
        },
        onDrag: (edge) => {
            setClosestEdge(edge);
        },
    });

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCard(card.id);
            setShowDeleteConfirm(false);
        } catch (err) {
            console.error('Failed to delete card:', err);
            showError('Failed to delete card. Please try again.');
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const containerClasses =
        'group flex flex-col gap-2 rounded-lg border border-transparent bg-white p-3 shadow-sm transition-colors cursor-grab active:cursor-grabbing hover:border-primary/50';

    return (
        <>
            <div ref={cardRef} className="relative">
                <div className={containerClasses} onClick={handleOpenModal}>
                    <CardLabels labels={card.labels} />

                    <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium text-slate-700 flex-1 break-words">
                            {card.title}
                        </p>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={handleDelete}
                        >
                            <Trash2Icon />
                        </Button>
                    </div>

                    <CardFooter
                        members={card.members}
                        dueDate={card.dueDate}
                    />
                </div>

                {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
            </div>

            {showModal && <CardModal card={card} onClose={handleCloseModal} />}

            <ConfirmDialog
                open={showDeleteConfirm}
                title="Delete card?"
                description={`This will permanently delete "${card.title}".`}
                confirmLabel="Delete card"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
});

// Icons as components to avoid lucide-react issues
function Trash2Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    );
}

// DropIndicator from atlaskit
function DropIndicator({ edge, gap }) {
    return (
        <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
                [edge === 'top' ? 'top' : 'bottom']: `-${gap}px`,
                height: `${gap}px`,
            }}
        >
            <div className="w-full h-1 rounded-full bg-blue-400 mx-auto" />
        </div>
    );
}

export default CardItem;

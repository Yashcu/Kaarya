import { memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Skeleton as BoardSkeleton } from '@/shared/components/ui';

import BoardMenuItem from './BoardMenuItem';
import CreateBoardForm from './CreateBoardForm';

/**
 * BoardSwitcherDropdown - The dropdown menu for board selection/creation
 * Rendered in a portal to document.body
 */
const BoardSwitcherDropdown = memo(function BoardSwitcherDropdown({
    isOpen,
    position,
    boards,
    isLoading,
    currentBoardId,
    onCreate,
    onDelete,
    onClose,
}) {
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={dropdownRef}
            className="fixed w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden"
            style={{ top: position.top, left: position.left }}
        >
            {/* Header */}
            <div className="p-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1">
                    Your Boards
                </p>

                {isLoading ? (
                    <div className="py-2">
                        <BoardSkeleton />
                        <BoardSkeleton />
                        <BoardSkeleton />
                    </div>
                ) : (
                    boards.map((board) => (
                        <BoardMenuItem
                            key={board.id}
                            board={board}
                            isCurrent={board.id === currentBoardId}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>

            <div className="border-t p-2">
                <CreateBoardForm
                    onCreate={onCreate}
                    onCancel={onClose}
                />
            </div>
        </div>,
        document.body
    );
});

export default BoardSwitcherDropdown;

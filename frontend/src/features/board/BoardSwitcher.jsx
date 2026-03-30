import { memo } from 'react';
import { ChevronDown, LayoutDashboard } from 'lucide-react';

import BoardSwitcherDropdown from './BoardSwitcherDropdown';
import { useBoardSwitcher } from './useBoardSwitcher';
import { ConfirmDialog } from '@/shared/components/ui';

/**
 * BoardSwitcher - Component for switching between boards and creating new ones
 */
const BoardSwitcher = memo(function BoardSwitcher({ currentBoardId }) {
    const {
        btnRef,
        boards,
        currentBoard,
        isLoading,
        open,
        dropdownPos,
        boardToDelete,
        handleToggleOpen,
        handleClose,
        handleCreate,
        handleDelete,
        handleCancelDelete,
        handleConfirmDelete,
    } = useBoardSwitcher(currentBoardId);

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={handleToggleOpen}
                className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
                <LayoutDashboard className="h-4 w-4 shrink-0" />

                <span className="font-semibold text-sm max-w-[150px] truncate">
                    {currentBoard?.title || 'Boards'}
                </span>

                <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <BoardSwitcherDropdown
                isOpen={open}
                position={dropdownPos}
                boards={boards}
                isLoading={isLoading}
                currentBoardId={currentBoardId}
                onCreate={handleCreate}
                onDelete={handleDelete}
                onClose={handleClose}
            />

            <ConfirmDialog
                open={!!boardToDelete}
                title="Delete board?"
                description={`This will permanently delete "${boardToDelete?.title || 'this board'}" and all of its lists and cards.`}
                confirmLabel="Delete board"
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
});

export default BoardSwitcher;

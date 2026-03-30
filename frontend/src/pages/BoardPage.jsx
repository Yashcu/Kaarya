import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useBoardStore from '../store/useBoardStore';
import ListColumn from '../components/list/ListColumn';
import AddListButton from '../components/board/AddListButton';
import SearchFilterBar from '../components/board/SearchFilterBar';
import BoardSwitcher from '../components/board/BoardSwitcher';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useBoardAutoScroll } from '../hooks/useBoardAutoScroll';
import { BOARD_BACKGROUND_COLORS } from '../constants/board';

export default function BoardPage() {
    const { boardId } = useParams();
    const scrollContainerRef = useRef(null);

    const {
        board,
        isLoading,
        error,
        fetchBoard,
        getFilteredLists,
        updateBoardColor,
        searchQuery,
        activeFilters
    } = useBoardStore();

    const dnd = useDragAndDrop({
        disabled:
            Boolean(searchQuery) ||
            activeFilters.labels.length > 0 ||
            activeFilters.members.length > 0 ||
            activeFilters.hasDueDate,
    });

    useEffect(() => {
        if (boardId) {
            fetchBoard(boardId);
        }
    }, [boardId, fetchBoard]);

    useBoardAutoScroll(scrollContainerRef);

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!board) return null;

    const handleBoardColorChange = (color) => {
        updateBoardColor(color);
    };

    const filteredLists = getFilteredLists();

    return (
        <div
            className="relative min-h-screen flex flex-col overflow-hidden p-3 sm:p-4 lg:p-6"
            style={{ backgroundColor: board.backgroundColor || '#0f172a' }}
        >
            <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 min-h-0 flex-col gap-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <BoardSwitcher currentBoardId={boardId} />
                    <SearchFilterBar />

                    <div className="flex flex-wrap gap-2">
                        {BOARD_BACKGROUND_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleBoardColorChange(color)}
                                className="h-6 w-6 rounded-full ring-2 ring-white/10 ring-offset-2 ring-offset-transparent transition-transform duration-200 hover:scale-110 active:scale-95"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Lists */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide"
                >
                    <div className="flex h-full min-w-max items-start gap-4">
                        {filteredLists.length === 0 && <p className="text-white/70">No lists yet</p>}

                        {filteredLists.map((list, index) => (
                            <ListColumn
                                key={list.id}
                                list={list}
                                index={index}
                                dnd={dnd}
                                dndDisabled={dnd.disabled}
                            />
                        ))}

                        <AddListButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

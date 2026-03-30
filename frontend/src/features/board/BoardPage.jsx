import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAllBoards } from '../../api/boardApi';
import useBoardStore from '../../store/useBoardStore';
import ListColumn from '../list/ListColumn';
import AddListButton from './AddListButton';
import SearchFilterBar from './SearchFilterBar';
import BoardSwitcher from './BoardSwitcher';
import { useDragAndDrop } from './useBoardDragAndDrop';
import { useBoardAutoScroll } from './useBoardAutoScroll';
import { BOARD_BACKGROUND_COLORS } from '@/shared/constants';
import { useToast } from '@/shared/components/ui';

export default function BoardPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const { error: showError } = useToast();

    const {
        board,
        isLoading,
        error,
        fetchBoard,
        getFilteredLists,
        updateBoardColor,
        searchQuery,
        activeFilters,
    } = useBoardStore();

    const cardDndDisabled =
        Boolean(searchQuery) ||
        activeFilters.labels.length > 0 ||
        activeFilters.members.length > 0 ||
        activeFilters.hasDueDate;

    const dnd = useDragAndDrop({
        disabled: false,
    });

    useEffect(() => {
        let cancelled = false;

        if (boardId) {
            (async () => {
                const result = await fetchBoard(boardId);

                if (cancelled || result?.ok) {
                    return;
                }

                if (result?.status === 404) {
                    try {
                        const boardList = await getAllBoards();

                        if (cancelled) return;

                        if (boardList.length > 0) {
                            navigate(`/b/${boardList[0].id}`, { replace: true });
                            return;
                        }

                        navigate('/', { replace: true });
                    } catch (err) {
                        if (!cancelled) {
                            console.error('Failed to load fallback boards:', err);
                            navigate('/', { replace: true });
                        }
                    }
                }
            })();
        }

        return () => {
            cancelled = true;
        };
    }, [boardId, fetchBoard, navigate]);

    useBoardAutoScroll(scrollContainerRef);

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;
    if (error && !board) return <div className="p-6 text-red-500">{error}</div>;
    if (!board) return null;

    const handleBoardColorChange = async (color) => {
        try {
            await updateBoardColor(color);
        } catch {
            showError('Failed to update board color. Please try again.');
        }
    };

    const filteredLists = getFilteredLists();

    return (
        <div
            className="relative min-h-screen flex flex-col overflow-hidden p-3 sm:p-4 lg:p-6"
            style={{ backgroundColor: board.backgroundColor || '#0f172a' }}
        >
            <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 min-h-0 flex-col gap-4">
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
                                listDndDisabled={false}
                                cardDndDisabled={cardDndDisabled}
                            />
                        ))}

                        <AddListButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

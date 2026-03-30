import { create } from 'zustand';
import api from '../api/axiosInstance';
import {
    createList,
    deleteList as deleteListRequest,
    reorderLists,
    updateList,
} from '../api/listApi';
import {
    createCard,
    deleteCard as deleteCardRequest,
    moveCard,
} from '../api/cardApi';
import { updateBoard } from '../api/boardApi';
import { createEmptyFilters, filterListsByBoardFilters } from '../utils/boardFilters';
import { normalizeBoard } from '../utils/boardNormalization';

const useBoardStore = create((set, get) => ({
    board: null,
    isLoading: false,
    error: null,
    searchQuery: "",
    activeFilters: createEmptyFilters(),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setFilter: (key, value) => set((state) => ({
        activeFilters: {
            ...state.activeFilters,
            [key]: value,
        },
    })),

    clearFilters: () => set({
        searchQuery: "",
        activeFilters: createEmptyFilters(),
    }),

    fetchBoard: async (boardId) => {
        set({ isLoading: true, error: null });

        try {
            const board = normalizeBoard(await api.get(`/api/boards/${boardId}`));

            set({
                board,
                isLoading: false
            });
        } catch (err) {
            set({
                error: err || "Failed to fetch board",
                isLoading: false
            });
        }
    },

    refreshBoard: async (boardId) => {
        if (!boardId) return;

        try {
            const board = normalizeBoard(await api.get(`/api/boards/${boardId}`));
            set({ board });
        } catch (err) {
            set({ error: err || "Failed to refresh board" });
        }
    },

    addList: async (title) => {
        const board = get().board;
        if (!board) return;

        try {
            const list = await createList({ title, boardId: board.id });
            const normalizedList = {
                ...list,
                cards: list.cards || [],
            };

            set((state) => ({
                board: {
                    ...state.board,
                    lists: [...state.board.lists, normalizedList]
                }
            }));
        } catch (err) {
            set({ error: err || "Failed to create list" });
        }
    },

    deleteList: async (listId) => {
        try {
            await deleteListRequest(listId);

            set((state) => ({
                board: {
                    ...state.board,
                    lists: state.board.lists.filter(l => l.id !== listId)
                }
            }));
        } catch (err) {
            set({ error: err || "Failed to delete list" });
        }
    },

    updateListTitle: async (listId, title) => {
        try {
            await updateList(listId, { title });

            set((state) => ({
                board: {
                    ...state.board,
                    lists: state.board.lists.map(list =>
                        list.id === listId ? { ...list, title } : list
                    )
                }
            }));
        } catch (err) {
            set({ error: err || "Failed to update list" });
        }
    },

    addCard: async (listId, title) => {
        try {
            const card = await createCard({ listId, title });

            set((state) => ({
                board: {
                    ...state.board,
                    lists: state.board.lists.map(list =>
                        list.id === listId
                            ? { ...list, cards: [...(list.cards || []), card] }
                            : list
                    )
                }
            }));
        } catch (err) {
            set({ error: err || "Failed to create card" });
        }
    },

    deleteCard: async (cardId) => {
        try {
            await deleteCardRequest(cardId);

            set((state) => ({
                board: {
                    ...state.board,
                    lists: state.board.lists.map(list => ({
                        ...list,
                        cards: (list.cards || []).filter(c => c.id !== cardId)
                    }))
                }
            }));
        } catch (err) {
            set({ error: err || "Failed to delete card" });
        }
    },

    updateBoardColor: async (color) => {
        const board = get().board;
        if (!board) return;

        set((state) => ({
            board: {
                ...state.board,
                backgroundColor: color
            }
        }));

        try {
            await updateBoard(board.id, { backgroundColor: color });
        } catch (err) {
            set({ error: err || "Failed to update board color" });
        }
    },

    moveListLocal: (activeId, overId) => {
        set((state) => {
            const lists = [...(state.board?.lists || [])];
            const oldIndex = lists.findIndex((l) => l.id === activeId);
            if (oldIndex === -1) return state;

            let insertIndex;
            if (!overId) {
                insertIndex = lists.length - 1;
            } else {
                const overIndex = lists.findIndex((l) => l.id === overId);
                if (overIndex === -1 || activeId === overId) return state;

                insertIndex = oldIndex < overIndex ? overIndex - 1 : overIndex;
            }

            const [moved] = lists.splice(oldIndex, 1);
            lists.splice(insertIndex, 0, moved);

            return { board: { ...state.board, lists } };
        });
    },

    moveCardLocal: (activeId, overId, sourceListId, destListId) => {
        set((state) => {
            const lists = [...(state.board?.lists || [])];
            const sourceIndex = lists.findIndex((l) => l.id === sourceListId);
            const destIndex = lists.findIndex((l) => l.id === destListId);
            const source = lists[sourceIndex];
            const dest = lists[destIndex];

            if (!source || !dest) return state;

            const sourceCards = [...(source.cards || [])];
            const destCards = sourceListId === destListId ? sourceCards : [...(dest.cards || [])];
            const cardIndex = sourceCards.findIndex(c => c.id === activeId);
            if (cardIndex === -1) return state;

            const [card] = sourceCards.splice(cardIndex, 1);
            card.listId = destListId;

            let insertIndex;
            if (!overId) {
                insertIndex = destCards.length;
            } else {
                const overIndex = destCards.findIndex((c) => c.id === overId);
                if (overIndex === -1 || (sourceListId === destListId && activeId === overId)) return state;

                insertIndex =
                    sourceListId === destListId && cardIndex < overIndex
                        ? overIndex - 1
                        : overIndex;
            }

            destCards.splice(insertIndex, 0, card);

            const nextLists = lists.map((list) => {
                if (list.id === sourceListId && sourceListId === destListId) {
                    return { ...list, cards: destCards };
                }

                if (list.id === sourceListId) {
                    return { ...list, cards: sourceCards };
                }

                if (list.id === destListId) {
                    return { ...list, cards: destCards };
                }

                return list;
            });

            return { board: { ...state.board, lists: nextLists } };
        });
    },

    reorderListsServer: async (listId, newPosition) => {
        try {
            await reorderLists({ listId, newPosition });
        } catch (err) {
            set({ error: err || "Failed to reorder lists" });
        }
    },

    moveCardServer: async (data) => {
        try {
            await moveCard(data);
        } catch (err) {
            set({ error: err || "Failed to move card" });
        }
    },

    getFilteredLists: () => {
        const { board, searchQuery, activeFilters } = get();

        if (!board) return [];
        return filterListsByBoardFilters(board.lists || [], searchQuery, activeFilters);
    }
}));

export default useBoardStore;

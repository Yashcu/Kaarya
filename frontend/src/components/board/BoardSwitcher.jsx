import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Trash2, Check, LayoutDashboard } from 'lucide-react';
import { createBoard, deleteBoard, updateBoard } from '../../api/boardApi';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useBoards } from '../../hooks/useBoards';

export default function BoardSwitcher({ currentBoardId }) {
    const { boards, setBoards, isLoading, loadBoards } = useBoards();
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [renamingBoardId, setRenamingBoardId] = useState(null);
    const [renameTitle, setRenameTitle] = useState('');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const btnRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const currentBoard = boards.find(b => b.id === currentBoardId);

    useEffect(() => {
        loadBoards().catch(() => {});
    }, [currentBoardId, loadBoards]);

    useOutsideClick(
        [btnRef, dropdownRef],
        () => {
            setOpen(false);
            setCreating(false);
            setRenamingBoardId(null);
        },
        open
    );

    useEscapeKey(() => {
        setOpen(false);
        setCreating(false);
        setRenamingBoardId(null);
    });

    const handleToggleOpen = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
        setOpen(prev => !prev);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const board = await createBoard({
                title: newTitle.trim(),
                backgroundColor: '#0079bf'
            });

            setBoards(prev => [...prev, board]);

            setNewTitle('');
            setCreating(false);
            setOpen(false);

            navigate(`/b/${board.id}`);
        } catch {
            return;
        }
    };

    const startRename = (board) => {
        setRenamingBoardId(board.id);
        setRenameTitle(board.title || '');
    };

    const handleRename = async (e, boardId) => {
        e.preventDefault();

        if (!renameTitle.trim()) return;

        try {
            const updated = await updateBoard(boardId, {
                title: renameTitle.trim(),
            });

            setBoards(prev =>
                prev.map(board => (board.id === boardId ? updated : board))
            );

            setRenamingBoardId(null);
            setRenameTitle('');
        } catch {
            return;
        }
    };

    const handleDelete = async (e, boardId) => {
        e.stopPropagation();

        if (!confirm('Delete this board and all its lists and cards?')) return;

        try {
            await deleteBoard(boardId);

            setBoards(prev => prev.filter(b => b.id !== boardId));

            if (boardId === currentBoardId) {
                const remaining = boards.filter(b => b.id !== boardId);
                if (remaining.length > 0) {
                    navigate(`/b/${remaining[0].id}`);
                } else {
                    navigate('/');
                }
            }
        } catch {
            return;
        }
    };

    const dropdown = open ? createPortal(
        <div
            ref={dropdownRef}
            className="fixed w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
            <div className="p-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1">
                    Your Boards
                </p>

                {isLoading && (
                    <p className="text-xs text-slate-400 px-2 py-2">Loading...</p>
                )}

                {!isLoading && boards.map(board => (
                    <div
                        key={board.id}
                        onClick={() => {
                            if (renamingBoardId) return;
                            navigate(`/b/${board.id}`);
                            setOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-50 group"
                    >
                        <div
                            className="h-6 w-6 rounded-md shrink-0"
                            style={{ backgroundColor: board.backgroundColor || '#0079bf' }}
                        />

                        {renamingBoardId === board.id ? (
                            <input
                                autoFocus
                                value={renameTitle}
                                onChange={(e) => setRenameTitle(e.target.value)}
                                onBlur={(e) => handleRename(e, board.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setRenamingBoardId(null);
                                        setRenameTitle('');
                                    }
                                    if (e.key === 'Enter') {
                                        handleRename(e, board.id);
                                    }
                                }}
                                className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (board.id === currentBoardId) {
                                        startRename(board);
                                    } else {
                                        navigate(`/b/${board.id}`);
                                        setOpen(false);
                                    }
                                }}
                                className="text-left text-sm text-slate-700 flex-1 truncate font-medium hover:text-slate-900"
                            >
                                {board.title}
                            </button>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                            {board.id === currentBoardId && (
                                <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            )}

                            {board.id !== currentBoardId && (
                                <button
                                    onClick={(e) => handleDelete(e, board.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all shrink-0"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {/* CREATE BOARD */}
            <div className="border-t p-2">
                {!creating ? (
                        <button
                            onClick={() => setCreating(true)}
                            className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create new board
                        </button>
                ) : (
                    <form onSubmit={handleCreate} className="flex flex-col gap-2 px-1 py-1">
                        <input
                            autoFocus
                            placeholder="Board title"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 rounded-lg"
                            >
                                Create
                            </button>

                            <button
                                type="button"
                                onClick={() => setCreating(false)}
                                className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded-lg hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    ) : null;

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
                    className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {dropdown}
        </div>
    );
}

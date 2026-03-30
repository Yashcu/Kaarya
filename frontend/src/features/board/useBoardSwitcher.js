import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createBoard, deleteBoard } from '../../api/boardApi';
import { useBoards } from '../../hooks/useBoards';
import { useToast } from '@/shared/components/ui';

export function useBoardSwitcher(currentBoardId) {
    const navigate = useNavigate();
    const btnRef = useRef(null);
    const { error: showError } = useToast();

    const { boards, setBoards, isLoading, loadBoards } = useBoards();

    const [open, setOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [boardToDelete, setBoardToDelete] = useState(null);

    const currentBoard = useMemo(
        () => boards.find((board) => board.id === currentBoardId),
        [boards, currentBoardId]
    );

    useEffect(() => {
        loadBoards().catch((err) => {
            console.error('Failed to load boards:', err);
        });
    }, [loadBoards]);

    const handleToggleOpen = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
            });
        }
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = async (title) => {
        if (!title?.trim()) return;

        try {
            const board = await createBoard({
                title: title.trim(),
                backgroundColor: '#0079bf',
            });

            setBoards((prev) => [...prev, board]);
            handleClose();
            navigate(`/b/${board.id}`);
        } catch (err) {
            console.error('Failed to create board:', err);
            showError('Failed to create board. Please try again.');
        }
    };

    const handleDelete = (e, boardId) => {
        e.stopPropagation();
        const targetBoard = boards.find((board) => board.id === boardId);
        if (!targetBoard) return;
        setBoardToDelete(targetBoard);
    };

    const handleCancelDelete = () => {
        setBoardToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!boardToDelete) return;
        try {
            await deleteBoard(boardToDelete.id);

            setBoards((prev) => prev.filter((b) => b.id !== boardToDelete.id));
            setBoardToDelete(null);

            if (boardToDelete.id === currentBoardId) {
                const remaining = boards.filter((b) => b.id !== boardToDelete.id);
                if (remaining.length > 0) {
                    navigate(`/b/${remaining[0].id}`);
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Failed to delete board:', err);
            showError('Failed to delete board. Please try again.');
        }
    };

    return {
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
    };
}

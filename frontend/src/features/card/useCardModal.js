import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    updateCard,
    createChecklist,
    addChecklistItem,
    deleteChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    createLabelForCard,
    removeLabelFromCard,
    addMemberToCard,
    removeMemberFromCard,
} from '../../api/cardApi';
import { getAllMembers } from '../../api/memberApi';
import useBoardStore from '../../store/useBoardStore';
import { LABEL_COLORS } from '@/shared/constants';

export function formatDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function toDueDateIso(value) {
    if (!value) return null;

    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day, 12).toISOString();
}

export function useCardModal(card) {
    const board = useBoardStore((state) => state.board);
    const refreshBoard = useBoardStore((state) => state.refreshBoard);
    const boardId = board?.id;

    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [dueDate, setDueDate] = useState(formatDateInput(card.dueDate));
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [newLabelName, setNewLabelName] = useState('');
    const [selectedLabelColor, setSelectedLabelColor] = useState(LABEL_COLORS[0]);
    const [allMembers, setAllMembers] = useState([]);
    const [itemDrafts, setItemDrafts] = useState({});
    const [editDrafts, setEditDrafts] = useState({});
    const [actionError, setActionError] = useState('');

    const liveCard = useMemo(
        () =>
            board?.lists
                ?.flatMap((list) => list.cards || [])
                .find((currentCard) => currentCard.id === card.id) || card,
        [board, card]
    );

    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description || '');
        setDueDate(formatDateInput(card.dueDate));
    }, [card.id, card.title, card.description, card.dueDate]);

    useEffect(() => {
        let active = true;

        getAllMembers()
            .then((response) => {
                if (!active) return;
                setAllMembers(response || []);
            })
            .catch(() => {
                if (active) setAllMembers([]);
            });

        return () => {
            active = false;
        };
    }, []);

    const syncBoard = useCallback(async () => {
        if (boardId) {
            await refreshBoard(boardId);
        }
    }, [boardId, refreshBoard]);

    const runCardAction = useCallback(
        async (action, onSuccess) => {
            try {
                setActionError('');
                const result = await action();
                if (onSuccess) onSuccess();
                await syncBoard();
                return result;
            } catch (err) {
                setActionError(String(err));
                return null;
            }
        },
        [syncBoard]
    );

    const saveBasicInfo = useCallback(async () => {
        try {
            setActionError('');

            if (!title.trim()) {
                setTitle(card.title);
                setActionError('Card title cannot be empty.');
                return;
            }

            await updateCard(card.id, {
                title: title.trim(),
                description,
            });
            await syncBoard();
        } catch (err) {
            setActionError(String(err));
        }
    }, [card.id, card.title, description, syncBoard, title]);

    const handleDueDateChange = useCallback(
        async (nextDueDate) => {
            setDueDate(nextDueDate);

            try {
                setActionError('');
                await updateCard(card.id, {
                    dueDate: toDueDateIso(nextDueDate),
                });
                await syncBoard();
            } catch (err) {
                setActionError(String(err));
            }
        },
        [card.id, syncBoard]
    );

    const handleCreateChecklist = useCallback(
        async (e) => {
            e.preventDefault();
            if (!newChecklistTitle.trim()) return;

            runCardAction(
                () => createChecklist(card.id, { title: newChecklistTitle.trim() }),
                () => setNewChecklistTitle('')
            );
        },
        [card.id, newChecklistTitle, runCardAction]
    );

    const handleDeleteChecklist = useCallback(
        async (checklistId) => {
            await runCardAction(() => deleteChecklist(card.id, checklistId));
        },
        [card.id, runCardAction]
    );

    const handleAddChecklistItem = useCallback(
        async (e, checklistId) => {
            e.preventDefault();
            const text = (itemDrafts[checklistId] || '').trim();
            if (!text) return;

            runCardAction(
                () => addChecklistItem({ text, checklistId }),
                () => setItemDrafts((prev) => ({ ...prev, [checklistId]: '' }))
            );
        },
        [itemDrafts, runCardAction]
    );

    const handleUpdateChecklistText = useCallback(
        async (itemId, text) => {
            runCardAction(() => updateChecklistItem(itemId, { text }), () => {
                setEditDrafts((prev) => {
                    const next = { ...prev };
                    delete next[itemId];
                    return next;
                });
            });
        },
        [runCardAction]
    );

    const handleToggleChecklistItem = useCallback(
        async (item) => {
            runCardAction(() =>
                updateChecklistItem(item.id, {
                    isCompleted: !item.isCompleted,
                })
            );
        },
        [runCardAction]
    );

    const handleDeleteChecklistItem = useCallback(
        async (itemId) => {
            runCardAction(() => deleteChecklistItem(itemId), () => {
                setEditDrafts((prev) => {
                    const next = { ...prev };
                    delete next[itemId];
                    return next;
                });
            });
        },
        [runCardAction]
    );

    const handleCreateLabel = useCallback(() => {
        if (!newLabelName.trim()) return;

        runCardAction(
            () =>
                createLabelForCard(card.id, {
                    name: newLabelName.trim(),
                    color: selectedLabelColor,
                }),
            () => {
                setNewLabelName('');
                setSelectedLabelColor(LABEL_COLORS[0]);
            }
        );
    }, [card.id, newLabelName, runCardAction, selectedLabelColor]);

    const handleRemoveLabel = useCallback(
        async (labelId) => {
            await runCardAction(() => removeLabelFromCard(card.id, labelId));
        },
        [card.id, runCardAction]
    );

    const handleToggleMember = useCallback(
        async (member) => {
            if (!member?.id) return;

            const isAssigned = (liveCard.members || []).some((entry) => entry.memberId === member.id);

            runCardAction(() =>
                isAssigned
                    ? removeMemberFromCard(card.id, member.id)
                    : addMemberToCard(card.id, { memberId: member.id })
            );
        },
        [card.id, liveCard.members, runCardAction]
    );

    const handleClearDueDate = useCallback(async () => {
        await handleDueDateChange('');
    }, [handleDueDateChange]);

    const handleItemDraftChange = useCallback((checklistId, value) => {
        setItemDrafts((prev) => ({
            ...prev,
            [checklistId]: value,
        }));
    }, []);

    const handleEditDraftChange = useCallback((itemId, value) => {
        setEditDrafts((prev) => ({
            ...prev,
            [itemId]: value,
        }));
    }, []);

    const completedCount = (liveCard.checklists || []).reduce(
        (count, checklist) =>
            count + (checklist.items || []).filter((item) => item.isCompleted).length,
        0
    );

    const totalCount = (liveCard.checklists || []).reduce(
        (count, checklist) => count + (checklist.items || []).length,
        0
    );

    return {
        title,
        setTitle,
        description,
        setDescription,
        dueDate,
        setDueDate,
        newChecklistTitle,
        setNewChecklistTitle,
        newLabelName,
        setNewLabelName,
        selectedLabelColor,
        setSelectedLabelColor,
        allMembers,
        itemDrafts,
        editDrafts,
        actionError,
        liveCard,
        completedCount,
        totalCount,
        handleCreateChecklist,
        handleDeleteChecklist,
        handleAddChecklistItem,
        handleUpdateChecklistText,
        handleToggleChecklistItem,
        handleDeleteChecklistItem,
        handleCreateLabel,
        handleRemoveLabel,
        handleToggleMember,
        handleClearDueDate,
        handleDueDateChange,
        handleItemDraftChange,
        handleEditDraftChange,
        saveBasicInfo,
        labelColors: LABEL_COLORS,
    };
}

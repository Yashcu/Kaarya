import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    updateCard,
    createChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    createLabelForCard,
    removeLabelFromCard,
    addMemberToCard,
    removeMemberFromCard,
} from '../../api/cardApi';
import { getAllMembers } from '../../api/memberApi';
import useBoardStore from '../../store/useBoardStore';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { LABEL_COLORS } from '../../constants/board';

function formatDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
}

export default function CardModal({ card, onClose }) {
    const board = useBoardStore((s) => s.board);
    const refreshBoard = useBoardStore((s) => s.refreshBoard);

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

    useEscapeKey(onClose);

    const syncBoard = async () => {
        if (board?.id) {
            await refreshBoard(board.id);
        }
    };

    const runCardAction = async (action, onSuccess) => {
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
    };

    const saveBasicInfo = async () => {
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
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            });
            await syncBoard();
        } catch (err) {
            setActionError(String(err));
        }
    };

    const handleCreateChecklist = async (e) => {
        e.preventDefault();
        if (!newChecklistTitle.trim()) return;

        runCardAction(
            () => createChecklist(card.id, { title: newChecklistTitle.trim() }),
            () => setNewChecklistTitle('')
        );
    };

    const handleAddChecklistItem = async (e, checklistId) => {
        e.preventDefault();
        const text = (itemDrafts[checklistId] || '').trim();
        if (!text) return;

        runCardAction(
            () => addChecklistItem({ text, checklistId }),
            () => setItemDrafts((prev) => ({ ...prev, [checklistId]: '' }))
        );
    };

    const handleUpdateChecklistText = async (itemId, text) => {
        runCardAction(() => updateChecklistItem(itemId, { text }), () => {
            setEditDrafts((prev) => {
                const next = { ...prev };
                delete next[itemId];
                return next;
            });
        });
    };

    const handleToggleChecklistItem = async (item) => {
        runCardAction(() =>
            updateChecklistItem(item.id, {
                isCompleted: !item.isCompleted,
            })
        );
    };

    const handleDeleteChecklistItem = async (itemId) => {
        runCardAction(() => deleteChecklistItem(itemId), () => {
            setEditDrafts((prev) => {
                const next = { ...prev };
                delete next[itemId];
                return next;
            });
        });
    };

    const handleCreateLabel = async () => {
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
    };

    const handleToggleMember = async (member) => {
        const isAssigned = (liveCard.members || []).some((entry) => entry.memberId === member.id);

        runCardAction(() =>
            isAssigned
                ? removeMemberFromCard(card.id, member.id)
                : addMemberToCard(card.id, { memberId: member.id })
        );
    };

    const completedCount = (liveCard.checklists || []).reduce(
        (count, checklist) =>
            count + (checklist.items || []).filter((item) => item.isCompleted).length,
        0
    );

    const totalCount = (liveCard.checklists || []).reduce(
        (count, checklist) => count + (checklist.items || []).length,
        0
    );

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            onClick={onClose}
        >
            <div
                className="flex h-[100dvh] w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-4 py-4 sm:px-5 sm:py-4 lg:px-6">
                    <div className="flex-1 pr-3 sm:pr-4">
                        <input
                            className="w-full border-0 bg-transparent p-0 text-lg font-semibold text-slate-900 outline-none focus:ring-0 sm:text-2xl"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={saveBasicInfo}
                            placeholder="Card title"
                        />
                        <p className="mt-1 text-xs text-slate-500">Click outside fields to save changes</p>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClose} type="button">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.55fr)_360px]">
                        <div className="space-y-5 p-4 sm:space-y-6 sm:p-5 lg:p-6">
                            {actionError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {actionError}
                                </div>
                            )}

                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    Description
                                </div>
                                <textarea
                                    className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 sm:p-4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={saveBasicInfo}
                                    placeholder="Add a more detailed description..."
                                />
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">Checklists</h3>
                                        <p className="text-xs text-slate-500">
                                            {completedCount}/{totalCount} items completed
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleCreateChecklist} className="flex flex-col gap-2 sm:flex-row">
                                    <Input
                                        className="min-w-0"
                                        value={newChecklistTitle}
                                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                                        placeholder="Add checklist title"
                                    />
                                    <Button type="submit" className="w-full sm:w-auto">
                                        Add
                                    </Button>
                                </form>

                                <div className="space-y-4">
                                    {(liveCard.checklists || []).map((checklist) => {
                                        const items = checklist.items || [];
                                        const done = items.filter((item) => item.isCompleted).length;

                                        return (
                                            <div key={checklist.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{checklist.title}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {done}/{items.length} completed
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 space-y-2">
                                                    {items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-start gap-2 rounded-xl bg-white px-3 py-2"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleChecklistItem(item)}
                                                                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                                                    item.isCompleted
                                                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                        : 'border-slate-300 bg-white text-transparent'
                                                                }`}
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </button>

                                                            <input
                                                                value={editDrafts[item.id] ?? item.text}
                                                                onChange={(e) =>
                                                                    setEditDrafts((prev) => ({
                                                                        ...prev,
                                                                        [item.id]: e.target.value,
                                                                    }))
                                                                }
                                                                onBlur={(e) =>
                                                                    handleUpdateChecklistText(item.id, e.target.value.trim())
                                                                }
                                                                className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
                                                                    item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                                                }`}
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteChecklistItem(item.id)}
                                                                className="text-slate-400 transition hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <form
                                                    className="mt-3 flex flex-col gap-2 sm:flex-row"
                                                    onSubmit={(e) => handleAddChecklistItem(e, checklist.id)}
                                                >
                                                    <Input
                                                        className="min-w-0"
                                                        value={itemDrafts[checklist.id] || ''}
                                                        onChange={(e) =>
                                                            setItemDrafts((prev) => ({
                                                                ...prev,
                                                                [checklist.id]: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="Add checklist item"
                                                    />
                                                    <Button type="submit" className="w-full sm:w-auto">
                                                        Add
                                                    </Button>
                                                </form>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-5 border-t bg-slate-50 p-4 sm:space-y-6 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
                            <section className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Due Date
                                </h3>
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    onBlur={saveBasicInfo}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={async () => {
                                        setDueDate('');
                                        try {
                                            await updateCard(card.id, { dueDate: null });
                                            await syncBoard();
                                        } catch (err) {
                                            setActionError(String(err));
                                        }
                                    }}
                                >
                                    Clear due date
                                </Button>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Members
                                    </h3>
                                    <span className="text-xs text-slate-400">{allMembers.length} available</span>
                                </div>

                                <div className="space-y-2">
                                    {(liveCard.members || []).length === 0 ? (
                                        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                                            No members assigned yet
                                        </p>
                                    ) : (
                                        (liveCard.members || []).map((entry) => (
                                            <div
                                                key={entry.memberId}
                                                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm"
                                            >
                                                <span
                                                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                                                    style={{ backgroundColor: entry.member?.avatarColor || '#64748b' }}
                                                >
                                                    {entry.member?.name?.[0] || '?'}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                                                    {entry.member?.name || 'Unnamed member'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleMember(entry.member)}
                                                    className="text-slate-400 transition hover:text-red-600"
                                                    aria-label="Remove member"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Assign from members
                                    </p>

                                    <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
                                        {allMembers.map((member) => {
                                            const assigned = (liveCard.members || []).some(
                                                (entry) => entry.memberId === member.id
                                            );

                                            return (
                                                <button
                                                    key={member.id}
                                                    type="button"
                                                    onClick={() => handleToggleMember(member)}
                                                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition ${
                                                        assigned
                                                            ? 'bg-blue-50 ring-1 ring-blue-200'
                                                            : 'hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <span
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                                                        style={{ backgroundColor: member.avatarColor }}
                                                    >
                                                        {member.name?.[0] || '?'}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                                                        {member.name}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                            assigned
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {assigned ? 'Assigned' : 'Add'}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Card Labels
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    {(liveCard.labels || []).length === 0 ? (
                                        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                                            No labels on this card yet
                                        </p>
                                    ) : (
                                        (liveCard.labels || []).map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm"
                                            >
                                                <span
                                                    className="h-4 w-4 rounded-full"
                                                    style={{ backgroundColor: entry.color || '#cbd5e1' }}
                                                />
                                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                                                    {entry.name || 'Unnamed label'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        runCardAction(() => removeLabelFromCard(card.id, entry.id))
                                                    }
                                                    className="text-slate-400 transition hover:text-red-600"
                                                    aria-label="Remove label"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                                    <Input
                                        className="min-w-0"
                                        value={newLabelName}
                                        onChange={(e) => setNewLabelName(e.target.value)}
                                        placeholder="New label name"
                                    />

                                    <div className="flex flex-wrap gap-2">
                                        {LABEL_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedLabelColor(color)}
                                                className={`h-7 w-7 rounded-full ring-offset-2 transition-transform hover:scale-110 ${
                                                    selectedLabelColor === color
                                                        ? 'ring-2 ring-slate-900'
                                                        : 'ring-1 ring-slate-200'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>

                                    <Button type="button" className="w-full" onClick={handleCreateLabel}>
                                        Create label
                                    </Button>
                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

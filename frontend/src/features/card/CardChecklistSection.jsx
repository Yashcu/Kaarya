import { Check, Trash2 } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';

export default function CardChecklistSection({
    checklists,
    completedCount,
    totalCount,
    newChecklistTitle,
    onNewChecklistTitleChange,
    onCreateChecklist,
    onRequestDeleteChecklist,
    itemDrafts,
    onItemDraftChange,
    onAddChecklistItem,
    editDrafts,
    onEditDraftChange,
    onUpdateChecklistText,
    onToggleChecklistItem,
    onDeleteChecklistItem,
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">Checklists</h3>
                    <p className="text-xs text-slate-500">
                        {completedCount}/{totalCount} items completed
                    </p>
                </div>
            </div>

            <form onSubmit={onCreateChecklist} className="flex flex-col gap-2 sm:flex-row">
                <Input
                    className="min-w-0"
                    value={newChecklistTitle}
                    onChange={(e) => onNewChecklistTitleChange(e.target.value)}
                    placeholder="Add checklist title"
                />
                <Button type="submit" className="w-full sm:w-auto">
                    Add
                </Button>
            </form>

            <div className="space-y-4">
                {checklists.map((checklist) => {
                    const items = checklist.items || [];
                    const done = items.filter((item) => item.isCompleted).length;

                    return (
                        <div
                            key={checklist.id}
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{checklist.title}</p>
                                    <p className="text-xs text-slate-500">
                                        {done}/{items.length} completed
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRequestDeleteChecklist(checklist)}
                                    className="text-slate-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                                    aria-label="Delete checklist"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-3 space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-start gap-2 rounded-xl bg-white px-3 py-2"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onToggleChecklistItem(item)}
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
                                            onChange={(e) => onEditDraftChange(item.id, e.target.value)}
                                            onBlur={(e) => onUpdateChecklistText(item.id, e.target.value.trim())}
                                            className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
                                                item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => onDeleteChecklistItem(item.id)}
                                            className="text-slate-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form
                                className="mt-3 flex flex-col gap-2 sm:flex-row"
                                onSubmit={(e) => onAddChecklistItem(e, checklist.id)}
                            >
                                <Input
                                    className="min-w-0"
                                    value={itemDrafts[checklist.id] || ''}
                                    onChange={(e) => onItemDraftChange(checklist.id, e.target.value)}
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
    );
}

import { Trash2 } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';

export default function CardLabelsSection({
    labels,
    newLabelName,
    onNewLabelNameChange,
    selectedLabelColor,
    onSelectedLabelColorChange,
    labelColors,
    onCreateLabel,
    onRemoveLabel,
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Card Labels
                </h3>
            </div>

            <div className="space-y-2">
                {labels.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                        No labels on this card yet
                    </p>
                ) : (
                    labels.map((entry) => (
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
                                onClick={() => onRemoveLabel(entry.id)}
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
                    onChange={(e) => onNewLabelNameChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    placeholder="New label name"
                />

                <div className="flex flex-wrap gap-2">
                    {labelColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => onSelectedLabelColorChange(color)}
                            className={`h-7 w-7 rounded-full ring-offset-2 transition-transform hover:scale-110 ${
                                selectedLabelColor === color
                                    ? 'ring-2 ring-slate-900'
                                    : 'ring-1 ring-slate-200'
                            }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>

                <Button type="button" className="w-full" onClick={onCreateLabel}>
                    Create label
                </Button>
            </div>
        </section>
    );
}

import { DatePicker } from '@/shared/components/ui';

export default function CardDueDateSection({
    dueDate,
    onDueDateChange,
    onClearDueDate,
}) {
    return (
        <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Due Date
            </h3>
            <DatePicker
                value={dueDate}
                onChange={onDueDateChange}
                onClear={onClearDueDate}
            />
        </section>
    );
}

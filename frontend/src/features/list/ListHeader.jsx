import { memo } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import InlineEdit from '@/shared/components/InlineEdit';

/**
 * ListHeader component - list title, delete button, drag handle
 */
const ListHeader = memo(function ListHeader({
    listId,
    title,
    onUpdateTitle,
    onDelete,
    dndDisabled,
    dragHandleRef,
}) {
    return (
        <div className="flex items-start justify-between gap-2 rounded-t-xl px-3 py-3">
            <div className="min-w-0 flex-1">
                <InlineEdit
                    value={title}
                    onSave={(nextTitle) => onUpdateTitle(listId, nextTitle)}
                    disabled={dndDisabled}
                />
            </div>

            <button
                type="button"
                onClick={onDelete}
                className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                aria-label="Delete list"
                disabled={dndDisabled}
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <button
                ref={dragHandleRef}
                type="button"
                aria-label="Drag list"
                className="mt-0.5 inline-flex h-6 w-6 cursor-grab items-center justify-center rounded text-slate-400 active:cursor-grabbing"
                disabled={dndDisabled}
            >
                <GripVertical className="h-4 w-4" />
            </button>
        </div>
    );
});

export default ListHeader;

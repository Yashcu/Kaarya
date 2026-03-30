import { useEffect, useState } from 'react';

export default function InlineEdit({ value, onSave }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    const save = () => {
        if (!draft.trim()) {
            setDraft(value);
            setEditing(false);
            return;
        }

        if (draft !== value) {
            onSave(draft.trim());
        }

        setEditing(false);
    };

    if (editing) {
        return (
            <input
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onBlur={save}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') save();
                    if (e.key === 'Escape') {
                        setDraft(value);
                        setEditing(false);
                    }
                }}
                className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-blue-500"
            />
        );
    }

    return (
        <h2
            tabIndex={0}
            onClick={() => setEditing(true)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') setEditing(true);
            }}
            className="cursor-text rounded px-1 py-0.5 text-sm font-semibold leading-tight text-[#172b4d] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        >
            {value}
        </h2>
    );
}

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import Button from './Button';

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, onCancel]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{description}</p>

                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="ghost" type="button" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button variant="destructive" type="button" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

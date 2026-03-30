import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui';

export default function CardModalHeader({ title, onTitleChange, onTitleBlur, onClose }) {
    return (
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-4 py-4 sm:px-5 sm:py-4 lg:px-6">
            <div className="flex-1 pr-3 sm:pr-4">
                <input
                    className="w-full border-0 bg-transparent p-0 text-lg font-semibold text-slate-900 outline-none focus:ring-0 sm:text-2xl"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    onBlur={onTitleBlur}
                    placeholder="Card title"
                />
                <p className="mt-1 text-xs text-slate-500">Click outside fields to save changes</p>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} type="button">
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
}

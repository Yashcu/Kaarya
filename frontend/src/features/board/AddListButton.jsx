import { useState } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { Plus, X } from 'lucide-react';
import { Button, Input, useToast } from '@/shared/components/ui';

export default function AddListButton() {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const addList = useBoardStore((s) => s.addList);
    const { error: showError } = useToast();

    const handleAdd = async (e) => {
        e?.preventDefault?.();

        if (!title.trim()) return;

        try {
            setIsLoading(true);
            await addList(title);
            setTitle('');
            setIsAdding(false);
        } catch {
            showError('Failed to create list. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAdding) {
        return (
            <div className="flex h-full w-[85vw] max-w-[22rem] shrink-0 flex-col rounded-xl bg-slate-100/50 p-2 shadow-sm sm:w-80">
                <form className="flex flex-col gap-2" onSubmit={handleAdd}>
                    <Input
                        placeholder="Enter list title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setIsAdding(false);
                                setTitle('');
                            }
                        }}
                        autoFocus
                    />

                    <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add List'}
                        </Button>

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                setIsAdding(false);
                                setTitle('');
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            className="h-full w-[85vw] max-w-[22rem] shrink-0 justify-start self-start bg-white/15 border-white/20 border-dashed border-2 text-slate-900 hover:bg-white/25 sm:w-80"
            onClick={() => setIsAdding(true)}
        >
            <Plus className="mr-2 h-4 w-4" />
            Add another list
        </Button>
    );
}

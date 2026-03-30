import { memo, useState } from 'react';
import { Button, Input } from '@/shared/components/ui';

/**
 * CreateBoardForm component - form for creating a new board
 */
const CreateBoardForm = memo(function CreateBoardForm({
    onCreate,
    onCancel,
    autoFocus = false,
}) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onCreate(title.trim());
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-1 py-1">
            <Input
                autoFocus={autoFocus}
                placeholder="Board title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-2">
                <Button
                    type="submit"
                    className="flex-1"
                >
                    Create
                </Button>

                <Button
                    type="button"
                    onClick={onCancel}
                    variant="ghost"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
});

export default CreateBoardForm;

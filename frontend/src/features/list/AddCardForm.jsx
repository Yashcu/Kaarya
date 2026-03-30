import { memo, useState } from 'react';
import { Button, Input } from '@/shared/components/ui';

/**
 * AddCardForm component - form to add a new card to a list
 */
const AddCardForm = memo(function AddCardForm({ onAdd, onCancel }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd(title.trim());
        setTitle('');
    };

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input
                placeholder="Enter card title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
            />
            <div className="flex gap-2">
                <Button
                    type="submit"
                >
                    Add
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

export default AddCardForm;

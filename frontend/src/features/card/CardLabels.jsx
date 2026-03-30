import { memo } from 'react';

/**
 * CardLabels component - displays labels on a card
 */
const CardLabels = memo(function CardLabels({ labels }) {
    if (!labels || labels.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1">
            {labels.map((label) => (
                <span
                    key={label.id}
                    className="text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: label.color }}
                    title={label.name}
                >
                    {label.name}
                </span>
            ))}
        </div>
    );
});

export default CardLabels;

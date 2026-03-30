import { memo } from 'react';
import CardItem from '../card/CardItem';
import { Skeleton as CardSkeleton } from '@/shared/components/ui';

/**
 * ListCardsArea component - displays cards in a list column
 */
const ListCardsArea = memo(function ListCardsArea({
    cards,
    dnd,
    dndDisabled,
    isDropActive,
    isLoading,
    cardsRef,
}) {
    if (isLoading) {
        return (
            <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div
            ref={cardsRef}
            className={`flex-1 min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-2 transition-colors ${
                isDropActive ? 'bg-blue-50/70' : ''
            }`}
        >
            {cards.length === 0 && !isLoading && (
                <p
                    className={`text-xs px-2 ${
                        isDropActive
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-500'
                    }`}
                >
                    {isDropActive ? 'Drop card here' : 'No cards'}
                </p>
            )}

            {cards.map((card) => (
                <CardItem
                    key={card.id}
                    card={card}
                    dnd={dnd}
                    dndDisabled={dndDisabled}
                />
            ))}
        </div>
    );
});

export default ListCardsArea;

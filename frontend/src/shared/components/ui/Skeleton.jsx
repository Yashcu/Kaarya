/**
 * Skeleton loading component
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant='text'] - 'text', 'card', 'list', 'board'
 */
export default function Skeleton({ className = '', variant = 'text' }) {
    const baseClasses = 'animate-pulse bg-slate-200';

    const variantClasses = {
        text: 'h-4 w-full rounded',
        card: 'h-32 w-full rounded-lg',
        list: 'h-full w-[22rem] max-w-[85vw] rounded-xl',
        board: 'h-64 w-full rounded-xl',
        circle: 'h-8 w-8 rounded-full',
        button: 'h-9 w-24 rounded-md',
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || variantClasses.text} ${className}`}
            aria-hidden="true"
        />
    );
}

/**
 * Skeleton for a board card (used in board switcher)
 */
export function BoardSkeleton() {
    return (
        <div className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg">
            <Skeleton variant="circle" className="h-6 w-6" />
            <Skeleton variant="text" className="flex-1" />
            <Skeleton variant="button" className="h-6 w-6" />
        </div>
    );
}

/**
 * Skeleton for a list column
 */
export function ListSkeleton() {
    return (
        <div className="flex h-full w-[85vw] max-w-[22rem] shrink-0 flex-col rounded-xl bg-slate-100 p-3 shadow-sm sm:w-80">
            <Skeleton variant="text" className="mb-3 h-5 w-3/4" />
            <div className="flex-1 space-y-2 overflow-y-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="card" />
                ))}
            </div>
        </div>
    );
}

/**
 * Skeleton for a card item
 */
export function CardSkeleton() {
    return (
        <div className="p-3 rounded-lg">
            <Skeleton variant="text" className="mb-2 h-4 w-full" />
            <Skeleton variant="text" className="h-3 w-2/3" />
        </div>
    );
}

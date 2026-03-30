import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

/**
 * Single board item in the dropdown
 */
const BoardMenuItem = memo(function BoardMenuItem({
    board,
    isCurrent,
    onDelete,
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/b/${board.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex items-center gap-2.5 w-full px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                isCurrent ? 'bg-slate-50' : 'hover:bg-slate-50'
            } group`}
        >
            <div
                className="h-6 w-6 rounded-md shrink-0"
                style={{ backgroundColor: board.backgroundColor || '#0079bf' }}
            />

            <span
                className="text-left text-sm text-slate-700 flex-1 truncate font-medium hover:text-slate-900"
            >
                {board.title}
            </span>

            <div className="flex items-center gap-1 shrink-0">
                {isCurrent && (
                    <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                )}

                {!isCurrent && (
                    <button
                        onClick={(e) => onDelete(e, board.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all shrink-0"
                        aria-label="Delete board"
                    >
                        <Trash2Icon />
                    </button>
                )}
            </div>
        </div>
    );
});

function Trash2Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    );
}

export default BoardMenuItem;

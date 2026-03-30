import { memo, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Avatar } from '@/shared/components/ui';

/**
 * CardFooter component - displays due date and member avatars
 * @param {Array} props.members - Card members
 * @param {string} props.dueDate - Due date string
 */
const CardFooter = memo(function CardFooter({ members = [], dueDate }) {
    const isOverdue = useMemo(() => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }, [dueDate]);

    const displayMembers = members.slice(0, 3);
    const remainingCount = Math.max(0, members.length - 3);

    return (
        <div className="flex justify-between items-center mt-1">
            {dueDate && (
                <span
                    className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                        isOverdue
                            ? 'bg-red-100 text-red-600'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                >
                    <Calendar className="h-2.5 w-2.5" />
                    {new Date(dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            )}

            {members.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                    <div className="flex -space-x-1">
                        {displayMembers.map((cm) => (
                            <Avatar
                                key={cm.memberId}
                                name={cm.member?.name}
                                size="sm"
                                style={{
                                    backgroundColor: cm.member?.avatarColor || '#64748b',
                                }}
                                className="border-2 border-white"
                            />
                        ))}
                    </div>
                    {remainingCount > 0 && (
                        <span className="text-[10px] font-medium text-slate-500 ml-1">
                            +{remainingCount}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
});

export default CardFooter;

import { Trash2 } from 'lucide-react';

export default function CardMembersSection({
    members,
    availableMembers,
    onToggleMember,
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Members
                </h3>
                <span className="text-xs text-slate-400">{availableMembers.length} available</span>
            </div>

            <div className="space-y-2">
                {members.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                        No members assigned yet
                    </p>
                ) : (
                    members.map((entry) => (
                        <div
                            key={entry.memberId}
                            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm"
                        >
                            <span
                                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: entry.member?.avatarColor || '#64748b' }}
                            >
                                {entry.member?.name?.[0] || '?'}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                                {entry.member?.name || 'Unnamed member'}
                            </span>
                            <button
                                type="button"
                                onClick={() => onToggleMember(entry.member)}
                                className="text-slate-400 transition hover:text-red-600"
                                aria-label="Remove member"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Assign from members
                </p>

                <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
                    {availableMembers.map((member) => {
                        const assigned = members.some((entry) => entry.memberId === member.id);

                        return (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => onToggleMember(member)}
                                className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition ${
                                    assigned
                                        ? 'bg-blue-50 ring-1 ring-blue-200'
                                        : 'hover:bg-slate-50'
                                }`}
                            >
                                <span
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                                    style={{ backgroundColor: member.avatarColor }}
                                >
                                    {member.name?.[0] || '?'}
                                </span>
                                <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                                    {member.name}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                        assigned
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {assigned ? 'Assigned' : 'Add'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Filter, Calendar, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllMembers } from '../../api/memberApi';
import useBoardStore from '../../store/useBoardStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { countActiveFilters, hasActiveFilters } from '../../utils/boardFilters';

export default function SearchFilterBar() {
    const {
        searchQuery,
        activeFilters,
        setSearchQuery,
        setFilter,
        clearFilters,
        board
    } = useBoardStore();

    const [showFilters, setShowFilters] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchQuery || "");
    const [allMembers, setAllMembers] = useState([]);

    const containerRef = useRef(null);

    useEffect(() => {
        getAllMembers()
            .then((r) => setAllMembers(r || []))
            .catch(() => { });
    }, []);

    const debouncedSearch = useDebouncedValue(localSearch, 300);

    useEffect(() => {
        setSearchQuery(debouncedSearch);
    }, [debouncedSearch, setSearchQuery]);

    useEffect(() => {
        setLocalSearch(searchQuery || "");
    }, [searchQuery]);

    useOutsideClick(containerRef, () => setShowFilters(false), showFilters);

    const allLabels = useMemo(() => {
        if (!board) return [];

        return board.labels || [];
    }, [board]);

    const hasActiveFilter = hasActiveFilters(searchQuery, activeFilters);

    const toggleLabelFilter = (labelId) => {
        const updated = activeFilters.labels.includes(labelId)
            ? activeFilters.labels.filter((id) => id !== labelId)
            : [...activeFilters.labels, labelId];

        setFilter('labels', updated);
    };

    const toggleMemberFilter = (memberName) => {
        const updated = activeFilters.members.includes(memberName)
            ? activeFilters.members.filter(m => m !== memberName)
            : [...activeFilters.members, memberName];

        setFilter('members', updated);
    };

    return (
        <div ref={containerRef} className="relative flex items-center gap-2">

            {/* SEARCH */}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
                <Input
                    placeholder="Search cards..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-8 h-8 w-48 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 text-sm"
                />
            </div>

            {/* FILTER BUTTON */}
            <Button
                variant="ghost"
                size="sm"
                className={`h-8 text-white gap-1.5 ${showFilters ? 'bg-white/20' : ''}`}
                onClick={() => setShowFilters(prev => !prev)}
            >
                <Filter className="h-3.5 w-3.5" />
                <span className="text-sm hidden sm:inline">Filter</span>

                {hasActiveFilter && (
                    <span className="h-4 w-4 rounded-full bg-blue-400 text-white text-[9px] flex items-center justify-center">
                        {countActiveFilters(activeFilters)}
                    </span>
                )}
            </Button>

            {/* CLEAR BUTTON */}
            {hasActiveFilter && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={clearFilters}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            {/* FILTER PANEL */}
            {showFilters && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border p-4 w-72 z-40 space-y-4">

                    {/* DUE DATE */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Due Date
                        </p>

                        <button
                            onClick={() => setFilter('hasDueDate', !activeFilters.hasDueDate)}
                            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg border ${activeFilters.hasDueDate
                                ? 'bg-blue-50 border-blue-400 text-blue-700'
                                : 'border-slate-200'
                                }`}
                        >
                            Has a due date
                        </button>
                    </div>

                    {/* LABELS */}
                    {allLabels.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> Labels
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {allLabels.map(label => (
                                    <button
                                        key={label.id}
                                        onClick={() => toggleLabelFilter(label.id)}
                                        className={`text-xs px-2 py-1 rounded-full border ${activeFilters.labels.includes(label.id)
                                            ? 'bg-blue-500 text-white'
                                            : 'border-slate-300'
                                            }`}
                                        style={activeFilters.labels.includes(label.id) ? {} : { backgroundColor: `${label.color}20` }}
                                    >
                                        {label.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MEMBERS */}
                    {allMembers.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                <User className="h-3 w-3" /> Members
                            </p>

                            {allMembers.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => toggleMemberFilter(member.name)}
                                    className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm ${activeFilters.members.includes(member.name)
                                        ? 'bg-blue-50 border border-blue-300'
                                        : ''
                                        }`}
                                >
                                    <div
                                        className="h-6 w-6 rounded-full text-white text-xs flex items-center justify-center"
                                        style={{ backgroundColor: member.avatarColor }}
                                    >
                                        {member.name[0]}
                                    </div>
                                    {member.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            clearFilters();
                            setShowFilters(false);
                        }}
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}

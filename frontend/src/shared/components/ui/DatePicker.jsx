import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

import Button from './Button';

function pad(value) {
    return String(value).padStart(2, '0');
}

function parseDateString(value) {
    if (!value) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day, 12);
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date;
}

function toLocalDateString(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthLabel(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function isSameDay(left, right) {
    if (!left || !right) return false;

    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    );
}

function buildCalendarDays(monthDate) {
    const start = getMonthStart(monthDate);
    const firstVisible = new Date(start);
    firstVisible.setDate(firstVisible.getDate() - firstVisible.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(firstVisible);
        day.setDate(firstVisible.getDate() + index);
        return day;
    });
}

export default function DatePicker({ value, onChange, onClear }) {
    const wrapperRef = useRef(null);
    const selectedDate = useMemo(() => parseDateString(value), [value]);
    const [open, setOpen] = useState(false);
    const [monthDate, setMonthDate] = useState(
        () => getMonthStart(selectedDate || new Date())
    );

    useOutsideClick(wrapperRef, () => setOpen(false), open);

    useEffect(() => {
        if (selectedDate) {
            setMonthDate(getMonthStart(selectedDate));
            return;
        }

        if (!open) {
            setMonthDate(getMonthStart(new Date()));
        }
    }, [open, selectedDate]);

    const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
    const today = useMemo(() => new Date(), []);
    const displayValue = selectedDate
        ? new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(selectedDate)
        : 'Pick a due date';

    const handleSelect = async (date) => {
        const nextValue = toLocalDateString(date);
        await onChange?.(nextValue);
        setOpen(false);
    };

    const handleClear = async () => {
        await onClear?.();
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <Button
                type="button"
                variant="outline"
                className="w-full justify-between gap-3 rounded-2xl border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={() => setOpen((current) => !current)}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">{displayValue}</span>
                </span>
                <ChevronRight
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        open ? 'rotate-90' : ''
                    }`}
                />
            </Button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[19rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setMonthDate(
                                    (current) =>
                                        new Date(
                                            current.getFullYear(),
                                            current.getMonth() - 1,
                                            1
                                        )
                                )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="text-sm font-semibold text-slate-900">
                            {getMonthLabel(monthDate)}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setMonthDate(
                                    (current) =>
                                        new Date(
                                            current.getFullYear(),
                                            current.getMonth() + 1,
                                            1
                                        )
                                )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="mt-1 grid grid-cols-7 gap-1">
                        {days.map((day) => {
                            const isCurrentMonth =
                                day.getMonth() === monthDate.getMonth();
                            const isSelected = isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, today);

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    onClick={() => handleSelect(day)}
                                    className={`flex h-9 items-center justify-center rounded-lg text-sm transition ${
                                        isSelected
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : isToday
                                                ? 'border border-slate-300 bg-slate-50 text-slate-900'
                                                : 'text-slate-700 hover:bg-slate-100'
                                    } ${isCurrentMonth ? '' : 'text-slate-400'}`}
                                >
                                    {day.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelect(new Date())}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

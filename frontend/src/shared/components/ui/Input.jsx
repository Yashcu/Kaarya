import clsx from 'clsx';

/**
 * Reusable Input component
 */
export default function Input({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    'w-full px-3 py-2 border rounded-md shadow-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    error
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 text-slate-900 placeholder-slate-400',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {hint && !error && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
        </div>
    );
}

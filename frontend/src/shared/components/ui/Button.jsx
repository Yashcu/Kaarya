import clsx from 'clsx';

/**
 * Reusable Button component with variants and states
 */
export default function Button({
    children,
    variant = 'default',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) {
    const baseClasses =
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline:
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm rounded',
        md: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-6 py-2.5 text-base rounded-lg',
        icon: 'p-2 rounded-md',
    };

    const combinedClasses = clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
    );

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
}

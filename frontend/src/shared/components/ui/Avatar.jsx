import clsx from 'clsx';

/**
 * Avatar component for user avatars
 */
export default function Avatar({
    name,
    src,
    size = 'md',
    className = '',
    style,
}) {
    const initials = name
        ? name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    const sizeClasses = {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
        xl: 'h-12 w-12 text-lg',
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={clsx(
                    'rounded-full object-cover shrink-0',
                    sizeClasses[size],
                    className
                )}
            />
        );
    }

    return (
        <div
            className={clsx(
                'rounded-full flex items-center justify-center font-medium text-white shrink-0',
                sizeClasses[size],
                className
            )}
            style={style}
            title={name}
        >
            {initials}
        </div>
    );
}

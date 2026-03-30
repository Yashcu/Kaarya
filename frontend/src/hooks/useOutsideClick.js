import { useEffect } from 'react';

export function useOutsideClick(ref, onOutsideClick, enabled = true) {
    useEffect(() => {
        if (!enabled) return undefined;

        const handleMouseDown = (event) => {
            const refs = Array.isArray(ref) ? ref : [ref];
            const isInside = refs.some((item) => {
                const element = item?.current ?? item;
                return element && element.contains?.(event.target);
            });

            if (!isInside) {
                onOutsideClick?.(event);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);

        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [enabled, onOutsideClick, ref]);
}

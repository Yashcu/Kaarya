import { useEffect, useRef } from 'react';
import { BOARD_DND_STATE_EVENT } from '../../utils/boardDnd';

export function useBoardAutoScroll(scrollContainerRef) {
    const dragStateRef = useRef({ active: false, x: 0 });
    const rafRef = useRef(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return undefined;

        const EDGE_THRESHOLD = 160;
        const MAX_SPEED = 30;

        const stopAutoScroll = () => {
            dragStateRef.current.active = false;
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };

        const step = () => {
            if (!dragStateRef.current.active) {
                rafRef.current = null;
                return;
            }

            const rect = container.getBoundingClientRect();
            const x = dragStateRef.current.x;

            let delta = 0;

            if (x <= rect.left + EDGE_THRESHOLD) {
                const ratio = (rect.left + EDGE_THRESHOLD - x) / EDGE_THRESHOLD;
                delta = -Math.max(2, ratio * MAX_SPEED);
            } else if (x >= rect.right - EDGE_THRESHOLD) {
                const ratio = (x - (rect.right - EDGE_THRESHOLD)) / EDGE_THRESHOLD;
                delta = Math.max(2, ratio * MAX_SPEED);
            }

            if (delta !== 0) {
                container.scrollLeft += delta;
            }

            rafRef.current = requestAnimationFrame(step);
        };

        const startAutoScroll = (clientX) => {
            dragStateRef.current.active = true;
            dragStateRef.current.x = clientX;

            if (rafRef.current === null) {
                rafRef.current = requestAnimationFrame(step);
            }
        };

        const onMove = (event) => {
            if (!dragStateRef.current.active) return;
            dragStateRef.current.x = event.clientX;
        };

        const onDragState = (event) => {
            const detail = event.detail || {};
            if (detail.active) {
                startAutoScroll(detail.clientX || dragStateRef.current.x);
            } else {
                stopAutoScroll();
            }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('dragover', onMove);
        window.addEventListener(BOARD_DND_STATE_EVENT, onDragState);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('dragover', onMove);
            window.removeEventListener(BOARD_DND_STATE_EVENT, onDragState);
            stopAutoScroll();
        };
    }, [scrollContainerRef]);
}

import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const HEALTH_URL = `${API_BASE_URL}/health`;
const POLL_INTERVAL_MS = 3000;

export function useBackendWakeup() {
    const [state, setState] = useState({
        isReady: false,
        attempt: 0,
        hasShownColdStart: false,
        error: '',
    });

    useEffect(() => {
        let isCancelled = false;
        let timeoutId;

        const checkHealth = async (attempt = 1) => {
            try {
                const response = await fetch(HEALTH_URL, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Backend is still waking up');
                }

                if (!isCancelled) {
                    setState({
                        isReady: true,
                        attempt,
                        hasShownColdStart: attempt > 1,
                        error: '',
                    });
                }
            } catch (err) {
                if (isCancelled) return;

                setState({
                    isReady: false,
                    attempt,
                    hasShownColdStart: true,
                    error: attempt >= 8 ? 'This is taking longer than usual, but the app is still retrying.' : '',
                });

                timeoutId = window.setTimeout(() => {
                    checkHealth(attempt + 1);
                }, POLL_INTERVAL_MS);
            }
        };

        checkHealth();

        return () => {
            isCancelled = true;
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, []);

    return state;
}

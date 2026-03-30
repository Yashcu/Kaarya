import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createBoard } from '../api/boardApi';
import { useBoards } from '../hooks/useBoards';

export default function HomeBootstrap() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { loadBoards } = useBoards();

    useEffect(() => {
        let cancelled = false;

        const ensureBoardExists = async () => {
            try {
                const boards = await loadBoards();

                if (cancelled) return;

                if (boards?.length > 0) {
                    navigate(`/b/${boards[0].id}`, { replace: true });
                    return;
                }

                const board = await createBoard({
                    title: 'My Board',
                    backgroundColor: '#0079bf',
                });

                if (!cancelled) {
                    navigate(`/b/${board.id}`, { replace: true });
                }
            } catch (err) {
                if (!cancelled) {
                    setError(String(err || 'Failed to load boards'));
                }
            }
        };

        ensureBoardExists();

        return () => {
            cancelled = true;
        };
    }, [navigate, loadBoards]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" />
        </div>
    );
}

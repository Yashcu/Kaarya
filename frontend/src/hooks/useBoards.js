import { useCallback, useState } from 'react';
import { getAllBoards } from '../api/boardApi';

export function useBoards() {
    const [boards, setBoards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadBoards = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getAllBoards();
            const nextBoards = data || [];
            setBoards(nextBoards);
            return nextBoards;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        boards,
        setBoards,
        isLoading,
        loadBoards,
    };
}

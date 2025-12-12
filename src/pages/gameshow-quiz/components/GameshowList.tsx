import { useEffect, useState } from 'react';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks/useGameshowQuiz';
import { GameshowCard } from './GameshowCard';

export const GameshowList = () => {
    const { getAllGames } = useGameshowQuiz();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllGames();
                setGames(data || []);
            } catch (err: any) {
                console.error('Error loading games:', err);
                const errorMsg = err?.response?.data?.message || err?.message || 'Failed to load games';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [getAllGames]);

    if (loading) return <div className="flex items-center justify-center py-20">Loading...</div>;
    if (error) return <div className="text-red-600 py-4">Error: {error}</div>;
    if (!games || games.length === 0) return <div className="text-gray-600 py-4">No games found</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daftar Games</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game: any) => (
                    <GameshowCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};
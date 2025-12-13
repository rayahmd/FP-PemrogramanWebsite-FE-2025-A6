import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameshowQuiz } from './hooks/useGameshowQuiz';
import GameCard from './components/GameCard';

const GameshowQuizListPage = () => {
  const { getAllGames } = useGameshowQuiz();
  const navigate = useNavigate();
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    getAllGames().then(setGames);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gameshow Quiz</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/create-gameshow-quiz')}
        >
          + Buat Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={() => navigate(`/gameshow-quiz/play/${game.id}`)}
            onEdit={() => navigate(`/gameshow-quiz/edit/${game.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameshowQuizListPage;

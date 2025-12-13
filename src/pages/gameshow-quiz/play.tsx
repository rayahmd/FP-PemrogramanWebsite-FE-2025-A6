import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameshowQuiz } from './hooks/useGameshowQuiz';
import GamePlayer from './components/GamePlayer';

const PlayGameshowPage = () => {
  const { id } = useParams<{ id: string }>();
  const { playGamePublic } = useGameshowQuiz();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    playGamePublic(id).then(setGame);
  }, [id]);

  if (!game) return <p>Loading game...</p>;

  return <GamePlayer game={game} />;
};

export default PlayGameshowPage;

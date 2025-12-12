import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks/useGameshowQuiz';
import { Button } from './Button';
import type { GameshowGameData } from '@/api/gameshow-quiz/gameshow-quiz.api';

export const GameshowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGameDetail, deleteGame, loading, error } = useGameshowQuiz();
  const [gameData, setGameData] = useState<GameshowGameData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      try {
        const data = await getGameDetail(id);
        setGameData(data);
      } catch (err) {
        console.error('Error loading game:', err);
      }
    };

    loadGame();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Apakah Anda yakin ingin menghapus game ini?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteGame(id);
      
      setTimeout(() => {
        navigate('/gameshow');
      }, 1000);
    } catch (err) {
      console.error('Error deleting game:', err);
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20">Loading...</div>;
  if (error) return <div className="text-red-600 py-4">Error: {error}</div>;
  if (!gameData) return <div className="text-red-600 py-4">Game not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{gameData.title}</h1>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="primary"
            onClick={() => navigate(`/gameshow/${id}/play`)}
          >
            Mainkan
          </Button>
          <Button
            variant="warning"
            onClick={() => navigate(`/gameshow/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Deskripsi</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">{gameData.description || 'Tidak ada deskripsi'}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Soal ({gameData.questions.length})</h2>
          <div className="space-y-4">
            {gameData.questions.map((question, index) => (
              <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Soal {index + 1}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{question.text}</p>
                    {question.imageUrl && (
                      <img src={question.imageUrl} alt="question" className="w-full max-h-48 object-contain rounded-md mt-3" />
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <div><strong>Waktu:</strong> {question.timeLimit}s</div>
                    <div><strong>Poin:</strong> {question.points}</div>
                    <div><strong>Pilihan:</strong> {question.options.length}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

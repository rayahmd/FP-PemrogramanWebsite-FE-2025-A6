import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateGameshowForm from './components/CreateGameshowForm';
import { useGameshowQuiz } from './hooks/useGameshowQuiz';

const EditGameshowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGameDetail } = useGameshowQuiz();

  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getGameDetail(id).then(setInitialData);
  }, [id]);

  if (!initialData) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Gameshow Quiz</h1>

      <CreateGameshowForm
        initialData={initialData}
        gameId={id}
        onSuccess={() => navigate(`/gameshow-quiz/${id}`)}
      />
    </div>
  );
};

export default EditGameshowPage;

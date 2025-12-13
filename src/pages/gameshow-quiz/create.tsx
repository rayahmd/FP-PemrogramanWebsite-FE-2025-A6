import { useNavigate } from 'react-router-dom';
import CreateGameshowForm from './components/CreateGameshowForm';

const CreateGameshowPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buat Gameshow Quiz</h1>

      <CreateGameshowForm
        onSuccess={(gameId) => {
          navigate(`/gameshow-quiz/${gameId}`);
        }}
      />
    </div>
  );
};

export default CreateGameshowPage;

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditGameshowform } from './components';

export const EditGameshowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>Invalid game ID</div>;
  }

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/gameshow-quiz');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Game</h1>
          <p className="text-gray-600 mt-2">Ubah detail gameshow quiz Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <EditGameshowform gameId={id} />
        </div>
      </div>
    </div>
  );
};

export default EditGameshowPage;

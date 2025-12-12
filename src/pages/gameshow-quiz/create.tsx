import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGameshowForm as CreateForm } from './components';

export const CreateGameshowPage = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Buat Game Baru</h1>
          <p className="text-gray-600 mt-2">Isi form di bawah untuk membuat gameshow quiz baru</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <CreateForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default CreateGameshowPage;

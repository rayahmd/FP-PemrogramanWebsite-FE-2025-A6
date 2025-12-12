import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameshowList } from './components';
import { Button } from './components/Button';

export const GameshowQuizPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gameshow Quiz</h1>
            <p className="text-gray-600">Buat dan kelola gameshow quiz Anda</p>
          </div>
          <Button
            onClick={() => navigate('/gameshow-quiz/create')}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            + Buat Game Baru
          </Button>
        </div>

        <GameshowList />
      </div>
    </div>
  );
};

export default GameshowQuizPage;

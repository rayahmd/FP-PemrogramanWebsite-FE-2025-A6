import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks/useGameshowQuiz';
import type { GameshowGameData } from '@/api/gameshow-quiz/gameshow-quiz.api';
import { QuestionDisplay } from './QuestionDisplay';
import { QuizTimer } from './QuizTimer';
import { ResultModal } from './ResultModal';
import { Button } from './Button';

interface PlayGameshowPrivateProps {
  gameId?: string;
}

export const PlayGameshowPrivate = ({ gameId: propGameId }: PlayGameshowPrivateProps) => {
  const { id: paramGameId } = useParams<{ id: string }>();
  const gameId = propGameId || paramGameId;
  const { playGamePrivate, checkAnswer, loading, error } = useGameshowQuiz();
  
  const [gameData, setGameData] = useState<GameshowGameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      try {
        const data = await playGamePrivate(gameId);
        setGameData(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    loadGame();
  }, [gameId]);

  const handleAnswerClick = async (optionId: string) => {
    if (answered || !gameData) return;

    const currentQuestion = gameData.questions[currentQuestionIndex];

    try {
      setAnswered(true);
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: optionId
      });

      const result = await checkAnswer(gameId!, {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        timeTaken: currentQuestion.timeLimit
      });

      setLastResult(result);

      if (result.isCorrect) {
        setScore((prev) => prev + result.score);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleNextQuestion = () => {
    if (!gameData) return;

    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswered(false);
      setLastResult(null);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setLastResult(null);
    setGameFinished(false);
    setSelectedAnswers({});
  };

  if (loading) return <div className="flex items-center justify-center py-20">Loading...</div>;
  if (error) return <div className="text-red-600 py-4">Error: {error}</div>;
  if (!gameData) return <div className="text-red-600 py-4">Game not found</div>;

  if (gameFinished) {
    const correctAnswers = Object.keys(selectedAnswers).length;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-xl w-full text-center shadow-lg">
          <h1 className="text-3xl font-bold mb-4">🎉 Selesai!</h1>
          <div className="final-score mb-4">
            <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-300">{score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Poin</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-sm text-gray-500">Benar</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-300">{correctAnswers}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-sm text-gray-500">Salah</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-300">{gameData.questions.length - correctAnswers}</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{gameData.questions.length}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleRestart} size="lg">Main Lagi</Button>
            <Button variant="secondary" onClick={() => window.history.back()} size="lg">Kembali</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = gameData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === gameData.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{gameData.title}</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">Skor: {score}</div>
      </div>

      <div className="mb-6">
        <QuizTimer
          duration={currentQuestion.timeLimit}
          onTimeUp={() => {
            if (!answered) {
              setAnswered(true);
            }
          }}
        />
      </div>

      <QuestionDisplay
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={gameData.questions.length}
        onSelectOption={handleAnswerClick}
        disabled={answered}
      />

      {answered && lastResult && (
        <ResultModal
          isCorrect={lastResult.isCorrect}
          score={lastResult.score}
          message={lastResult.message}
          correctAnswerText={
            !lastResult.isCorrect
              ? gameData.questions[currentQuestionIndex].options.find(
                  (opt) => opt.id === lastResult.correctOptionId
                )?.text
              : undefined
          }
          onNext={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
};

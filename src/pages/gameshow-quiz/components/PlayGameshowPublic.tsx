import { useEffect, useState } from 'react';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks/useGameshowQuiz';
import type { GameshowGameData } from '@/api/gameshow-quiz/gameshow-quiz.api';
import { QuestionDisplay } from './QuestionDisplay';
import { QuizTimer } from './QuizTimer';
import { ResultModal } from './ResultModal';

interface PlayGameshowPublicProps {
  gameId: string;
}

export const PlayGameshowPublic = ({ gameId }: PlayGameshowPublicProps) => {
  const { playGamePublic, checkAnswer, loading, error } = useGameshowQuiz();
  const [gameData, setGameData] = useState<GameshowGameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await playGamePublic(gameId);
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
      const result = await checkAnswer(gameId, {
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
    if (currentQuestionIndex < gameData!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswered(false);
      setLastResult(null);
    } else {
      // Quiz finished
      alert(`Quiz selesai! Skor akhir: ${score}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20">Loading...</div>;
  if (error) return <div className="text-red-600 py-4">Error: {error}</div>;
  if (!gameData) return <div className="text-red-600 py-4">Game not found</div>;

  const currentQuestion = gameData.questions[currentQuestionIndex];

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
                  (opt: any) => opt.id === lastResult.correctOptionId
                )?.text
              : undefined
          }
          onNext={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === gameData.questions.length - 1}
        />
      )}
    </div>
  );
};
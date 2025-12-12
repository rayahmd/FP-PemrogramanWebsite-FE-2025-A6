interface ResultModalProps {
  isCorrect: boolean;
  score: number;
  message: string;
  correctAnswerText?: string;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const ResultModal = ({
  isCorrect,
  score,
  message,
  correctAnswerText,
  onNext,
  isLastQuestion
}: ResultModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 ${isCorrect ? 'ring-4 ring-green-200 dark:ring-green-800' : 'ring-4 ring-red-200 dark:ring-red-800'}`}>
        <h2 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{message}</h2>
        <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">+{score} Poin</p>

        {!isCorrect && correctAnswerText && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 rounded text-sm text-red-800 dark:text-red-100">Jawaban yang benar: <strong className="text-red-900 dark:text-red-50">{correctAnswerText}</strong></div>
        )}

        <div className="mt-6 text-right">
          <button onClick={onNext} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold">
            {isLastQuestion ? 'Lihat Hasil' : 'Soal Berikutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};
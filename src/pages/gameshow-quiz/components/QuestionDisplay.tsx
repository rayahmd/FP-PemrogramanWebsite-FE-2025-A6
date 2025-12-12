import type { GameshowQuestion } from '@/api/gameshow-quiz/gameshow-quiz.api';
import { OptionButton } from './OptionButton';

interface QuestionDisplayProps {
  question: GameshowQuestion;
  currentIndex: number;
  totalQuestions: number;
  onSelectOption: (optionId: string) => void;
  disabled: boolean;
}

export const QuestionDisplay = ({
  question,
  currentIndex,
  totalQuestions,
  onSelectOption,
  disabled
}: QuestionDisplayProps) => {
  return (
    <div className="question-display">
      <div className="question-header">
        <p>Soal {currentIndex + 1} dari {totalQuestions}</p>
        <p className="points">Poin: {question.points}</p>
      </div>

      {question.imageUrl && (
        <img src={question.imageUrl} alt="question" className="question-image" />
      )}

      <h2 className="question-text">{question.text}</h2>

      <div className="options-container">
        {question.options.map((option: any, idx: number) => (
          <OptionButton
            key={option.id}
            option={option}
            index={idx}
            onSelect={() => onSelectOption(option.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
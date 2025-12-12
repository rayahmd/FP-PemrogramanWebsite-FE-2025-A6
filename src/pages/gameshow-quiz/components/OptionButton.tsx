import type { GameshowOption } from '@/api/gameshow-quiz/gameshow-quiz.api';
import { cn } from '@/lib/utils';

interface OptionButtonProps {
  option: GameshowOption;
  index: number;
  onSelect: () => void;
  disabled: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}

const labelLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

export const OptionButton = ({
  option,
  index,
  onSelect,
  disabled,
  isSelected = false,
  isCorrect = false,
  showResult = false
}: OptionButtonProps) => {
  const getButtonStyles = () => {
    if (!showResult) {
      return cn(
        'option-button',
        isSelected && 'selected',
        disabled && 'disabled'
      );
    }

    if (isCorrect) {
      return 'option-button correct';
    }

    if (isSelected && !isCorrect) {
      return 'option-button incorrect';
    }

    return 'option-button';
  };

  return (
    <button
      className={getButtonStyles()}
      onClick={onSelect}
      disabled={disabled}
      type="button"
    >
      <span className="option-label">{labelLetters[index]}</span>
      <span className="option-text">{option.text}</span>
    </button>
  );
};

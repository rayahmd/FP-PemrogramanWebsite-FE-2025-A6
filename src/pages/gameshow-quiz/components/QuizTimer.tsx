import { useEffect, useState } from 'react';

interface QuizTimerProps {
  duration: number;
  onTimeUp: () => void;
}

export const QuizTimer = ({ duration, onTimeUp }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const isWarning = timeLeft <= 5;

  return (
    <div className={`quiz-timer ${isWarning ? 'warning' : ''}`}>
      <span>{timeLeft}s</span>
    </div>
  );
};
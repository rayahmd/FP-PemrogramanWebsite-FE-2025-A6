import { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  onEnd: () => void;
  resetKey?: number | string;
}

const Timer = ({ seconds, onEnd, resetKey }: TimerProps) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    setTime(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (time <= 0) {
      onEnd();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, onEnd]);

  const isLowTime = time <= 5;
  const percentage = (time / seconds) * 100;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-colors duration-300 ${
          isLowTime
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-blue-500 bg-blue-50 text-blue-600"
        }`}
        style={{
          background: `conic-gradient(${isLowTime ? "#ef4444" : "#3b82f6"} ${percentage}%, #e5e7eb ${percentage}%)`,
        }}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
            isLowTime ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          }`}
        >
          {time}
        </div>
      </div>
      <span className="text-sm text-slate-500 mt-2">detik</span>
    </div>
  );
};

export default Timer;

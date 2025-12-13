import { useEffect, useState } from "react";

const Timer = ({ seconds, onEnd }: { seconds: number; onEnd: () => void }) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) {
      onEnd();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  return <div className="text-xl">⏱ {time}s</div>;
};

export default Timer;

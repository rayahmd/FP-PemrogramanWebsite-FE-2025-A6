import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Trophy, Home, Volume2, VolumeX } from "lucide-react";
import Timer from "./Timer";
import { useGameshowQuiz } from "../hooks/useGameshowQuiz";
import { ResultModal } from "./ScoreResult";

// Audio imports
import bgMusic from "../audio/background.mp3";
import correctSound from "../audio/correct.mp3";
import errorSound from "../audio/error.mp3";
import celebrationSound from "../audio/celebration.mp3";

interface GamePlayerProps {
  game: {
    id: string;
    name?: string;
    title?: string;
    questions: Array<{
      id: string;
      text: string;
      timeLimit: number;
      points: number;
      options: Array<{
        id: string;
        text: string;
      }>;
    }>;
  };
  onBack?: () => void;
}

const GamePlayer = ({ game, onBack }: GamePlayerProps) => {
  const { checkAnswer } = useGameshowQuiz();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    correct: boolean;
    points: number;
    correctAnswerText?: string;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Audio refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);
  const celebrationSoundRef = useRef<HTMLAudioElement | null>(null);

  const questions = game?.questions ?? [];
  const question = questions[idx];

  // Initialize audio
  useEffect(() => {
    bgMusicRef.current = new Audio(bgMusic);
    correctSoundRef.current = new Audio(correctSound);
    errorSoundRef.current = new Audio(errorSound);
    celebrationSoundRef.current = new Audio(celebrationSound);

    // Configure background music
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;
    }

    // Configure sound effects
    if (correctSoundRef.current) correctSoundRef.current.volume = 0.5;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0.5;
    if (celebrationSoundRef.current) celebrationSoundRef.current.volume = 0.6;

    return () => {
      // Cleanup audio on unmount
      bgMusicRef.current?.pause();
      correctSoundRef.current?.pause();
      errorSoundRef.current?.pause();
      celebrationSoundRef.current?.pause();
    };
  }, []);

  // Start background music when game starts
  useEffect(() => {
    if (game && questions.length > 0 && !gameFinished && !isMuted) {
      bgMusicRef.current?.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    }
  }, [game, questions.length, gameFinished, isMuted]);

  // Handle mute toggle
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Play sound effect with background dip
  const playSoundEffect = useCallback(
    (soundRef: React.RefObject<HTMLAudioElement | null>) => {
      if (isMuted || !soundRef.current) return;

      // Dip background music volume
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.1;
      }

      // Reset and play sound effect
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});

      // Restore background volume when sound effect ends
      soundRef.current.onended = () => {
        if (bgMusicRef.current && !gameFinished) {
          bgMusicRef.current.volume = 0.3;
        }
      };
    },
    [isMuted, gameFinished],
  );

  // Play celebration and stop background when game finishes
  const playCelebration = useCallback(() => {
    if (isMuted) return;

    // Stop background music
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }

    // Play celebration
    if (celebrationSoundRef.current) {
      celebrationSoundRef.current.currentTime = 0;
      celebrationSoundRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const handleTimeUp = useCallback(() => {
    playSoundEffect(errorSoundRef);
    setLastResult({
      correct: false,
      points: 0,
      correctAnswerText: undefined,
    });
    setShowResult(true);
  }, [playSoundEffect]);

  const handleNext = () => {
    setShowResult(false);
    setLastResult(null);
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setGameFinished(true);
      playCelebration();
    }
    setIdx(nextIdx);
  };

  if (!game || !questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Typography className="text-slate-500 mb-6">
          Tidak ada pertanyaan tersedia
        </Typography>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        )}
      </div>
    );
  }

  // Game finished
  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <Typography variant="h2" className="text-2xl font-bold mb-2">
            Game Selesai!
          </Typography>
          <Typography className="text-slate-500 mb-6">
            {game.name || game.title || "Gameshow Quiz"}
          </Typography>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6">
            <Typography className="text-white text-sm mb-1">
              Skor Akhir
            </Typography>
            <Typography className="text-white text-4xl font-bold">
              {score}
            </Typography>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Main Lagi
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => (window.location.href = "/gameshow-quiz")}
            >
              <Home className="w-4 h-4 mr-2" />
              Daftar Game
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const answer = async (optionId: string) => {
    try {
      const res = await checkAnswer(game.id, {
        questionId: question.id,
        selectedOptionId: optionId,
      });

      const isCorrect = res?.isCorrect ?? false;
      const earnedPoints = res?.score ?? 0;

      // Play appropriate sound effect
      if (isCorrect) {
        playSoundEffect(correctSoundRef);
        setScore((s) => s + earnedPoints);
      } else {
        playSoundEffect(errorSoundRef);
      }

      setLastResult({
        correct: isCorrect,
        points: earnedPoints,
        correctAnswerText: res?.correctAnswerText,
      });
      setShowResult(true);
    } catch (err) {
      console.error("Error memeriksa jawaban:", err);
      handleNext();
    }
  };

  const progressPercent = ((idx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <Typography className="text-white/80 text-sm">
                Soal {idx + 1} dari {questions.length}
              </Typography>
              <div className="w-32 h-2 bg-white/20 rounded-full mt-1">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <Typography className="text-white font-bold">
                Skor: {score}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {/* Timer */}
            <div className="flex justify-center mb-6">
              <Timer
                seconds={question.timeLimit}
                onEnd={handleTimeUp}
                resetKey={idx}
              />
            </div>

            {/* Question */}
            <Typography className="text-xl md:text-2xl font-bold text-center mb-8">
              {question.text}
            </Typography>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((o, index) => {
                const colors = [
                  "bg-red-500 hover:bg-red-600",
                  "bg-blue-500 hover:bg-blue-600",
                  "bg-yellow-500 hover:bg-yellow-600",
                  "bg-green-500 hover:bg-green-600",
                ];
                return (
                  <button
                    key={o.id}
                    onClick={() => answer(o.id)}
                    className={`${colors[index % 4]} text-white p-4 rounded-xl font-semibold text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && lastResult && (
        <ResultModal
          isCorrect={lastResult.correct}
          score={lastResult.points}
          message={lastResult.correct ? "Benar!" : "Salah!"}
          correctAnswerText={lastResult.correctAnswerText}
          onNext={handleNext}
          isLastQuestion={idx >= questions.length - 1}
        />
      )}
    </div>
  );
};

export default GamePlayer;

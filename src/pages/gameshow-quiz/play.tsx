import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGameshowQuiz } from "./hooks/useGameshowQuiz";
import GamePlayer from "./components/GamePlayer";
import type { GameshowGameData } from "@/api/gameshow-quiz/types";

const PlayGameshowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playGame } = useGameshowQuiz();
  const [game, setGame] = useState<GameshowGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || hasFetched.current) return;
    hasFetched.current = true;

    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await playGame(id);
        console.log("Data game diterima:", data);
        setGame(data);
      } catch (err: unknown) {
        console.error("Gagal memuat game:", err);
        const error = err as { message?: string };
        setLoadError(error.message || "Gagal memuat game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, playGame]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <Typography className="text-slate-600">Memuat game...</Typography>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Typography className="text-red-500 text-lg mb-2">
          Error: {loadError}
        </Typography>
        <Typography className="text-slate-500 text-sm mb-6">
          Game ID: {id}
        </Typography>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Typography className="text-slate-500 mb-6">
          Game tidak ditemukan
        </Typography>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return <GamePlayer game={game} onBack={() => navigate(-1)} />;
};

export default PlayGameshowPage;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Navbar from "@/components/ui/layout/Navbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import CreateGameshowForm from "./components/CreateGameshowForm";
import { useGameshowQuiz } from "./hooks/useGameshowQuiz";
import type { GameshowGameData } from "@/api/gameshow-quiz/types";

const EditGameshowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDetail } = useGameshowQuiz();
  const [initialData, setInitialData] = useState<GameshowGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || hasFetched.current) return;
    hasFetched.current = true;

    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await getDetail(id);
        setInitialData(data);
      } catch (err) {
        console.error("Gagal memuat game:", err);
        setError("Gagal memuat data game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, getDetail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-slate-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Typography className="text-red-500 mb-4">
            {error || "Game tidak ditemukan"}
          </Typography>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent text-orange-500 hover:text-orange-600 mb-2 font-bold text-lg h-auto p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          <Typography
            variant="h2"
            className="mb-1 font-bold text-slate-900 text-2xl border-none pb-0"
          >
            Edit Gameshow Quiz
          </Typography>
          <Typography variant="muted" className="text-slate-500 text-sm">
            Perbarui kuis interaktifmu
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <CreateGameshowForm
            initialData={initialData}
            gameId={id}
            onSuccess={() => navigate(`/gameshow-quiz/play/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditGameshowPage;

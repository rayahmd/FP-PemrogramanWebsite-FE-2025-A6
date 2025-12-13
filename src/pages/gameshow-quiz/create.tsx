import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Navbar from "@/components/ui/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import CreateGameshowForm from "./components/CreateGameshowForm";

const CreateGameshowPage = () => {
  const navigate = useNavigate();

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
            Buat Gameshow Quiz
          </Typography>
          <Typography variant="muted" className="text-slate-500 text-sm">
            Buat kuis interaktif dengan 10 pertanyaan
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <CreateGameshowForm
            onSuccess={(gameId) => {
              navigate(`/gameshow-quiz/play/${gameId}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGameshowPage;

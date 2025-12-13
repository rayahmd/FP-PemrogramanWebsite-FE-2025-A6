import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { Plus, Save, Loader2 } from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import { useGameshowQuiz } from "../hooks/useGameshowQuiz";
import type { GameshowQuestion } from "@/api/gameshow-quiz/types";
import toast from "react-hot-toast";

interface GameInitialData {
  name?: string;
  title?: string;
  description?: string;
  questions?: GameshowQuestion[];
}

interface CreateGameshowFormProps {
  onSuccess: (gameId?: string) => void;
  initialData?: GameInitialData;
  gameId?: string;
}

const CreateGameshowForm = ({
  onSuccess,
  initialData,
  gameId,
}: CreateGameshowFormProps) => {
  const { createGame, updateGame, loading } = useGameshowQuiz();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<GameshowQuestion[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || initialData.title || "");
      setDescription(initialData.description || "");
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  const addQuestion = () => {
    if (questions.length >= 10) {
      toast.error("Maksimal 10 soal!");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      {
        id: uuid(),
        text: "",
        timeLimit: 30,
        points: 10,
        options: [],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Nama game harus diisi!");
      return;
    }
    if (questions.length !== 10) {
      toast.error(`Harus ada 10 soal! (saat ini: ${questions.length})`);
      return;
    }

    // Validate each question has text and at least 2 options with 1 correct
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Soal ${i + 1}: Pertanyaan harus diisi!`);
        return;
      }
      if (q.options.length < 2) {
        toast.error(`Soal ${i + 1}: Minimal 2 pilihan jawaban!`);
        return;
      }
      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        toast.error(`Soal ${i + 1}: Harus ada 1 jawaban benar!`);
        return;
      }
    }

    try {
      const payload = {
        name,
        description,
        score_per_question: 10,
        countdown: 30,
        is_question_randomized: false,
        is_answer_randomized: false,
        questions,
      };

      if (gameId) {
        await updateGame(gameId, payload);
        toast.success("Game berhasil diperbarui!");
        onSuccess(gameId);
      } else {
        const result = await createGame(payload);
        toast.success("Game berhasil dibuat!");
        onSuccess(result?.id);
      }
    } catch (err) {
      console.error("Error menyimpan game:", err);
      toast.error("Gagal menyimpan game. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Info Card */}
      <Card className="p-6">
        <Typography className="font-semibold mb-4">Informasi Game</Typography>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Nama Game *
            </label>
            <Input
              placeholder="Masukkan nama game"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Deskripsi
            </label>
            <Textarea
              placeholder="Masukkan deskripsi game (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Questions Section */}
      <div className="flex items-center justify-between">
        <Typography className="font-semibold">
          Daftar Soal ({questions.length}/10)
        </Typography>
        <Button
          variant="outline"
          size="sm"
          onClick={addQuestion}
          disabled={questions.length >= 10}
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah Soal
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="p-8 text-center">
          <Typography className="text-slate-500 mb-4">
            Belum ada soal. Tambahkan 10 soal untuk melanjutkan.
          </Typography>
          <Button onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Soal Pertama
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionEditor
              key={q.id}
              index={i}
              question={q}
              onChange={(updated) =>
                setQuestions((prev) =>
                  prev.map((x, idx) => (idx === i ? updated : x)),
                )
              }
              onRemove={() => removeQuestion(i)}
            />
          ))}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={submit}
          disabled={loading || questions.length !== 10}
          className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {gameId ? "Perbarui Game" : "Simpan Game"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateGameshowForm;

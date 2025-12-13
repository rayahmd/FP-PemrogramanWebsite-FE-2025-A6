import { useState } from "react";
import { v4 as uuid } from "uuid";
import QuestionEditor from "./QuestionEditor";
import { useGameshowQuiz } from "../hooks/useGameshowQuiz";

const CreateGameshowForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { createGame, loading } = useGameshowQuiz();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    if (questions.length >= 10) return;
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

  const submit = async () => {
    if (questions.length !== 10) {
      alert("HARUS 10 SOAL");
      return;
    }

    await createGame({
      name,
      description,
      score_per_question: 10,
      countdown: 30,
      is_question_randomized: false,
      is_answer_randomized: false,
      questions,
    });

    onSuccess();
  };

  return (
    <div className="space-y-6">
      <input
        className="input w-full"
        placeholder="Nama Game"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="textarea w-full"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {questions.map((q, i) => (
        <QuestionEditor
          key={q.id}
          index={i}
          question={q}
          onChange={(updated) =>
            setQuestions((prev) =>
              prev.map((x, idx) => (idx === i ? updated : x))
            )
          }
        />
      ))}

      <button onClick={addQuestion} className="btn">
        + Tambah Soal ({questions.length}/10)
      </button>

      <button onClick={submit} disabled={loading} className="btn-primary">
        Simpan Gameshow
      </button>
    </div>
  );
};

export default CreateGameshowForm;

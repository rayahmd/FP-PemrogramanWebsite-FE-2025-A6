import OptionEditor from "./OptionEditor";
import { v4 as uuid } from "uuid";

const QuestionEditor = ({ question, onChange, index }: any) => {
  const addOption = () => {
    onChange({
      ...question,
      options: [
        ...question.options,
        { id: uuid(), text: "", isCorrect: false },
      ],
    });
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h3 className="font-bold">Soal #{index + 1}</h3>

      <input
        className="input w-full"
        placeholder="Pertanyaan"
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
      />

      <div className="flex gap-2">
        <input
          type="number"
          className="input"
          value={question.timeLimit}
          onChange={(e) =>
            onChange({ ...question, timeLimit: +e.target.value })
          }
        />
        <input
          type="number"
          className="input"
          value={question.points}
          onChange={(e) =>
            onChange({ ...question, points: +e.target.value })
          }
        />
      </div>

      {question.options.map((opt: any, i: number) => (
        <OptionEditor
          key={opt.id}
          option={opt}
          onChange={(updated) =>
            onChange({
              ...question,
              options: question.options.map((o: any, idx: number) =>
                idx === i ? updated : o
              ),
            })
          }
        />
      ))}

      <button onClick={addOption} className="btn-secondary">
        + Jawaban
      </button>
    </div>
  );
};

export default QuestionEditor;

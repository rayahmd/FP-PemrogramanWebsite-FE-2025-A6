import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { Plus, Trash2 } from "lucide-react";
import OptionEditor from "./OptionEditor";
import type {
  GameshowQuestion,
  GameshowOption,
} from "@/api/gameshow-quiz/types";

interface QuestionEditorProps {
  question: GameshowQuestion;
  onChange: (question: GameshowQuestion) => void;
  onRemove?: () => void;
  index: number;
}

const QuestionEditor = ({
  question,
  onChange,
  onRemove,
  index,
}: QuestionEditorProps) => {
  const addOption = () => {
    if (question.options.length >= 4) return;
    onChange({
      ...question,
      options: [
        ...question.options,
        { id: uuid(), text: "", isCorrect: false },
      ],
    });
  };

  const removeOption = (optionIndex: number) => {
    onChange({
      ...question,
      options: question.options.filter((_, i) => i !== optionIndex),
    });
  };

  return (
    <Card className="p-5">
      <div className="flex justify-between items-start mb-4">
        <Typography className="font-semibold text-blue-600">
          Soal #{index + 1}
        </Typography>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Pertanyaan *
          </label>
          <Textarea
            placeholder="Masukkan pertanyaan"
            value={question.text}
            onChange={(e) => onChange({ ...question, text: e.target.value })}
            rows={2}
          />
        </div>

        {/* Time and Points */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Waktu (detik)
            </label>
            <Input
              type="number"
              min={5}
              max={120}
              value={question.timeLimit}
              onChange={(e) =>
                onChange({ ...question, timeLimit: +e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Poin
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={question.points}
              onChange={(e) =>
                onChange({ ...question, points: +e.target.value })
              }
            />
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-700">
              Pilihan Jawaban ({question.options.length}/4)
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={addOption}
              disabled={question.options.length >= 4}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
          <div className="space-y-2">
            {question.options.map((opt: GameshowOption, i: number) => (
              <OptionEditor
                key={opt.id}
                option={opt}
                index={i}
                onChange={(updated: GameshowOption) =>
                  onChange({
                    ...question,
                    options: question.options.map(
                      (o: GameshowOption, idx: number) =>
                        idx === i ? updated : o,
                    ),
                  })
                }
                onRemove={() => removeOption(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionEditor;

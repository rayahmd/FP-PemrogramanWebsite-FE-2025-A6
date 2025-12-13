import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import type { GameshowOption } from "@/api/gameshow-quiz/types";

interface OptionEditorProps {
  option: GameshowOption;
  index: number;
  onChange: (option: GameshowOption) => void;
  onRemove?: () => void;
}

const OptionEditor = ({
  option,
  index,
  onChange,
  onRemove,
}: OptionEditorProps) => {
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      className={`flex gap-2 items-center p-3 rounded-lg border ${
        option.isCorrect
          ? "bg-green-50 border-green-300"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <span className="font-semibold text-slate-500 w-6">{letters[index]}</span>
      <Input
        className="flex-1 bg-white"
        placeholder={`Jawaban ${letters[index]}`}
        value={option.text}
        onChange={(e) => onChange({ ...option, text: e.target.value })}
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id={`correct-${option.id}`}
          checked={option.isCorrect}
          onCheckedChange={(checked) =>
            onChange({ ...option, isCorrect: checked === true })
          }
        />
        <label
          htmlFor={`correct-${option.id}`}
          className="text-sm text-slate-600 cursor-pointer"
        >
          Benar
        </label>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default OptionEditor;

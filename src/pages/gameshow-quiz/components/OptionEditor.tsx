const OptionEditor = ({ option, onChange }: any) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        className="input flex-1"
        placeholder="Jawaban"
        value={option.text}
        onChange={(e) => onChange({ ...option, text: e.target.value })}
      />

      <input
        type="checkbox"
        checked={option.isCorrect}
        onChange={(e) =>
          onChange({ ...option, isCorrect: e.target.checked })
        }
      />
      <span>Benar</span>
    </div>
  );
};

export default OptionEditor;

import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks';
import type { GameshowQuestion } from '@/api/gameshow-quiz/gameshow-quiz.api';

type OptionLocal = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type QuestionLocal = Omit<GameshowQuestion, 'options'> & {
  options: OptionLocal[];
};

interface Props {
  gameId: string;
}

export const EditGameshowform: React.FC<Props> = ({ gameId }) => {
  const { getGameDetail, updateGame } = useGameshowQuiz();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionLocal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGameDetail(gameId);
        setTitle(data.title || '');
        setDescription(data.description || '');
        const qs: QuestionLocal[] = (data.questions || []).map((q) => ({
          ...q,
          options: (q.options || []).map((o) => ({ ...o, isCorrect: false })),
        }));
        setQuestions(qs);
      } catch (err) {
        setError('Failed to load game');
      }
    };
    load();
  }, [gameId, getGameDetail]);

  const addQuestion = () => {
    const q: QuestionLocal = {
      id: Date.now().toString(),
      text: '',
      imageUrl: undefined,
      timeLimit: 30,
      points: 0,
      options: [{ id: Date.now().toString() + '-o1', text: '', isCorrect: false }],
    };
    setQuestions((s) => [...s, q]);
  };

  const removeQuestion = (index: number) => setQuestions((s) => s.filter((_, i) => i !== index));

  const updateQuestionField = (qIndex: number, field: keyof QuestionLocal, value: any) => {
    setQuestions((s) => s.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q)));
  };

  const addOption = (qIndex: number) => {
    setQuestions((s) =>
      s.map((q, i) =>
        i === qIndex
          ? { ...q, options: [...q.options, { id: Date.now().toString() + `-o${q.options.length + 1}`, text: '', isCorrect: false }] }
          : q
      )
    );
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((s) => s.map((q, i) => (i === qIndex ? { ...q, options: q.options.filter((_, oi) => oi !== oIndex) } : q)));
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((s) => s.map((q, i) => (i === qIndex ? { ...q, options: q.options.map((o, oi) => (oi === oIndex ? { ...o, text } : o)) } : q)));
  };

  const toggleOptionCorrect = (qIndex: number, oIndex: number) => {
    setQuestions((s) =>
      s.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, oi) => ({ ...o, isCorrect: oi === oIndex ? !o.isCorrect : o.isCorrect })) }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title,
        description,
        gameData: {
          questions: questions.map((q) => ({
            id: q.id,
            text: q.text,
            imageUrl: q.imageUrl,
            timeLimit: q.timeLimit,
            points: q.points,
            options: q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: !!o.isCorrect })),
          })),
        },
      };
      await updateGame(gameId, payload as any);
      setSuccess('Saved successfully');
    } catch (err) {
      setError('Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!questions) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Questions</h3>
          <button type="button" onClick={addQuestion} className="px-3 py-1 bg-green-600 text-white rounded">Add Question</button>
        </div>

        <div className="mt-4 space-y-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Question {qi + 1}</div>
                <div className="space-x-2">
                  <button type="button" onClick={() => removeQuestion(qi)} className="text-red-600">Remove</button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm">Text</label>
                  <textarea value={q.text} onChange={(e) => updateQuestionField(qi, 'text', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div>
                  <label className="block text-sm">Image URL</label>
                  <input value={q.imageUrl || ''} onChange={(e) => updateQuestionField(qi, 'imageUrl', e.target.value || undefined)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Time Limit (s)</label>
                    <input type="number" value={q.timeLimit} onChange={(e) => updateQuestionField(qi, 'timeLimit', parseInt(e.target.value || '0'))} className="mt-1 block w-full rounded border p-2" />
                  </div>
                  <div>
                    <label className="block text-sm">Points</label>
                    <input type="number" value={q.points} onChange={(e) => updateQuestionField(qi, 'points', parseInt(e.target.value || '0'))} className="mt-1 block w-full rounded border p-2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm">Options</label>
                    <button type="button" onClick={() => addOption(qi)} className="text-blue-600">Add Option</button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {q.options.map((o, oi) => (
                      <div key={o.id} className="flex items-center gap-2">
                        <input value={o.text} onChange={(e) => updateOptionText(qi, oi, e.target.value)} className="flex-1 rounded border p-2" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={!!o.isCorrect} onChange={() => toggleOptionCorrect(qi, oi)} />
                          Correct
                        </label>
                        <button type="button" onClick={() => removeOption(qi, oi)} className="text-red-600">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <div>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default EditGameshowform;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameshowQuiz } from '@/pages/gameshow-quiz/hooks/useGameshowQuiz';
import { Button } from './Button';
import type { GameshowQuestion } from '@/api/gameshow-quiz/gameshow-quiz.api';

export const CreateGameshowForm = () => {
  const navigate = useNavigate();
  const { createGame, loading, error, success } = useGameshowQuiz();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    thumbnail?: string;
    questions: GameshowQuestion[];
  }>({
    title: '',
    description: '',
    thumbnail: '',
    questions: [
      {
        id: '1',
        text: '',
        imageUrl: '',
        timeLimit: 30,
        points: 1000,
        options: [
          { id: 'a', text: '' },
          { id: 'b', text: '' }
        ]
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Judul game tidak boleh kosong');
      return;
    }

    if (formData.questions.some(q => !q.text.trim())) {
      alert('Semua soal harus memiliki pertanyaan');
      return;
    }

    if (formData.questions.some(q => q.options.some(opt => !opt.text.trim()))) {
      alert('Semua pilihan jawaban harus terisi');
      return;
    }

    try {
      await createGame({
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        gameData: {
          questions: formData.questions as any,
          randomizeQuestions: false
        }
      });

      setTimeout(() => {
        navigate('/gameshow');
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...formData.questions];
    if (field.startsWith('option.')) {
      const optionIndex = parseInt(field.split('.')[1]);
      const optionField = field.split('.')[2];
      updatedQuestions[index].options[optionIndex] = {
        ...updatedQuestions[index].options[optionIndex],
        [optionField]: value
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion: GameshowQuestion = {
      id: Date.now().toString(),
      text: '',
      imageUrl: '',
      timeLimit: 30,
      points: 1000,
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' }
      ]
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length === 1) {
      alert('Minimal harus ada satu soal');
      return;
    }
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options.length >= 6) {
      alert('Maksimal 6 pilihan jawaban');
      return;
    }
    const optionId = String.fromCharCode(97 + updatedQuestions[questionIndex].options.length);
    updatedQuestions[questionIndex].options.push({ id: optionId, text: '' });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options.length === 2) {
      alert('Minimal harus ada 2 pilihan jawaban');
      return;
    }
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Buat Game Baru</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Game *</label>
        <input
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Masukkan judul game"
          disabled={loading}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Masukkan deskripsi game"
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail URL</label>
        <input
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          placeholder="https://..."
          disabled={loading}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Soal-soal</h3>
        {formData.questions.map((question, qIndex) => (
          <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Soal {qIndex + 1}</h4>
              <Button
                variant="danger"
                size="sm"
                type="button"
                onClick={() => removeQuestion(qIndex)}
                disabled={loading}
              >
                Hapus
              </Button>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Pertanyaan *</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                placeholder="Masukkan pertanyaan"
                disabled={loading}
                rows={2}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Gambar URL</label>
              <input
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="url"
                value={question.imageUrl || ''}
                onChange={(e) => handleQuestionChange(qIndex, 'imageUrl', e.target.value)}
                placeholder="https://..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Waktu (detik)</label>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  value={question.timeLimit}
                  onChange={(e) => handleQuestionChange(qIndex, 'timeLimit', parseInt(e.target.value))}
                  min="5"
                  max="300"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Poin</label>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  value={question.points}
                  onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                  min="100"
                  step="100"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilihan Jawaban</h5>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <div key={option.id} className="flex gap-2 items-center">
                    <span className="w-6 text-sm font-semibold text-gray-700 dark:text-gray-200">{String.fromCharCode(65 + oIndex)}.</span>
                    <input
                      className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                      type="text"
                      value={option.text}
                      onChange={(e) => handleQuestionChange(qIndex, `option.${oIndex}.text`, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                      disabled={loading}
                    />
                    {question.options.length > 2 && (
                      <Button
                        variant="danger"
                        size="sm"
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        disabled={loading}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                {question.options.length < 6 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => addOption(qIndex)}
                    disabled={loading}
                  >
                    + Tambah Pilihan
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div>
          <Button
            variant="secondary"
            type="button"
            onClick={addQuestion}
            disabled={loading}
          >
            + Tambah Soal
          </Button>
        </div>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

      <div className="mt-6 flex gap-3">
        <Button type="submit" variant="primary" disabled={loading} loading={loading}>
          {loading ? 'Membuat...' : 'Buat Game'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};
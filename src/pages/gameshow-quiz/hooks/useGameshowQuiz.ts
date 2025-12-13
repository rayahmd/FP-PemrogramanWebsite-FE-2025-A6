import { useState } from 'react';
import { GameshowQuizAPI } from '@/api/gameshow-quiz/gameshow-quiz.api';
import type {
    CreateGameshowPayload,
    CheckAnswerPayload,
} from '../gameshow';

export const useGameshowQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const exec = async <T>(fn: () => Promise<T>) => {
        try {
            setLoading(true);
            setError(null);
            return await fn();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,

        createGame: (payload: CreateGameshowPayload) =>
            exec(() => GameshowQuizAPI.create(payload)),

        listGames: () =>
            exec(() => GameshowQuizAPI.list()),

        getDetail: (id: string) =>
            exec(() => GameshowQuizAPI.getDetail(id)),

        playGame: (id: string) =>
            exec(() => GameshowQuizAPI.play(id)),

        previewGame: (id: string) =>
            exec(() => GameshowQuizAPI.preview(id)),

        checkAnswer: (gameId: string, payload: CheckAnswerPayload) =>
            exec(() => GameshowQuizAPI.checkAnswer(gameId, payload)),
    };
};

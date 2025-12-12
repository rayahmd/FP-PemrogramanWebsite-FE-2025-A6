import { useState } from 'react';
import {
    GameshowQuizAPI,
    type GameshowGameData,
    type CheckAnswerResponse,
    type CheckAnswerPayload
} from '@/api/gameshow-quiz/gameshow-quiz.api';

export interface UseGameshowQuizState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

export const useGameshowQuiz = () => {
    const [state, setState] = useState<UseGameshowQuizState>({
        loading: false,
        error: null,
        success: null
    });

    const resetState = () => {
        setState({ loading: false, error: null, success: null });
    };

    // 1. CREATE GAME
    const createGame = async (payload: {
        title: string;
        description?: string;
        thumbnail?: string;
        gameData: {
            questions: Array<{
                id: string;
                text: string;
                imageUrl?: string;
                timeLimit: number;
                points: number;
                options: Array<{
                    id: string;
                    text: string;
                    isCorrect: boolean;
                }>;
            }>;
            randomizeQuestions?: boolean;
        };
    }) => {
        try {
            setState({ loading: true, error: null, success: null });
            const response = await GameshowQuizAPI.createGame(payload);
            setState({
                loading: false,
                error: null,
                success: 'Game berhasil dibuat!'
            });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || 'Gagal membuat game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 2. GET ALL GAMES
    const getAllGames = async () => {
        try {
            setState({ loading: true, error: null, success: null });
            const games = await GameshowQuizAPI.getAllGames();
            setState({ loading: false, error: null, success: null });
            return games;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Gagal mengambil data games';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 3. GET GAME DETAIL
    const getGameDetail = async (gameId: string): Promise<GameshowGameData> => {
        try {
            setState({ loading: true, error: null, success: null });
            const gameData = await GameshowQuizAPI.getGameParams(gameId);
            setState({ loading: false, error: null, success: null });
            return gameData;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Gagal mengambil detail game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 4. UPDATE GAME
    const updateGame = async (
        gameId: string,
        payload: {
            title: string;
            description?: string;
            thumbnail?: string;
            gameData: any;
        }
    ) => {
        try {
            setState({ loading: true, error: null, success: null });
            const response = await GameshowQuizAPI.updateGame(gameId, payload);
            setState({
                loading: false,
                error: null,
                success: 'Game berhasil diupdate!'
            });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || 'Gagal mengupdate game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 5. DELETE GAME
    const deleteGame = async (gameId: string) => {
        try {
            setState({ loading: true, error: null, success: null });
            const response = await GameshowQuizAPI.deleteGame(gameId);
            setState({
                loading: false,
                error: null,
                success: 'Game berhasil dihapus!'
            });
            return response;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Gagal menghapus game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 6. PLAY GAME (PUBLIC)
    const playGamePublic = async (gameId: string) => {
        try {
            setState({ loading: true, error: null, success: null });
            const gameData = await GameshowQuizAPI.playGamePublic(gameId);
            setState({ loading: false, error: null, success: null });
            return gameData;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Gagal memainkan game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 7. PLAY GAME (PRIVATE/PREVIEW)
    const playGamePrivate = async (gameId: string) => {
        try {
            setState({ loading: true, error: null, success: null });
            const gameData = await GameshowQuizAPI.playGamePrivate(gameId);
            setState({ loading: false, error: null, success: null });
            return gameData;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Gagal preview game';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    // 8. CHECK ANSWER
    const checkAnswer = async (
        gameId: string,
        payload: CheckAnswerPayload
    ): Promise<CheckAnswerResponse> => {
        try {
            setState({ loading: true, error: null, success: null });
            const result = await GameshowQuizAPI.checkAnswer(gameId, payload);
            setState({ loading: false, error: null, success: null });
            return result;
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || 'Gagal mengecek jawaban';
            setState({ loading: false, error: errorMsg, success: null });
            throw err;
        }
    };

    return {
        // State
        ...state,
        resetState,
        // Methods
        createGame,
        getAllGames,
        getGameDetail,
        updateGame,
        deleteGame,
        playGamePublic,
        playGamePrivate,
        checkAnswer
    };
};
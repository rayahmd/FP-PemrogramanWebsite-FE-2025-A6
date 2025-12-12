import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface GameshowOption {
    id: string;
    text: string;
}

export interface GameshowQuestion {
    id: string;
    text: string;
    imageUrl?: string;
    timeLimit: number;
    points: number;
    options: GameshowOption[];
}

export interface GameshowGameData {
    title: string;
    description: string;
    questions: GameshowQuestion[];
}

export interface CheckAnswerPayload {
    questionId: string;
    selectedOptionId: string;
    timeTaken?: number;
}

export interface CheckAnswerResponse {
    isCorrect: boolean;
    correctOptionId: string | null;
    score: number;
    message: string;
}

export const GameshowQuizAPI = {
    // 1. POST Create Gameshow Quiz
    createGame: async (payload: {
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
        const response = await axios.post(
            `${API_BASE}/game/game-list/gameshow-quiz`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    },

    // 2. GET Get All Gameshow Quiz
    getAllGames: async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${API_BASE}/game/game-list/gameshow-quiz`,
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
            }
        );
        return response.data.data || response.data;
    },

    // 3. GET Get Gameshow Quiz Detail
    getGameParams: async (gameId: string): Promise<GameshowGameData> => {
        const response = await axios.get(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data.data;
    },

    // 4. PUT Update Gameshow Quiz
    updateGame: async (
        gameId: string,
        payload: {
            title: string;
            description?: string;
            thumbnail?: string;
            gameData: any;
        }
    ) => {
        const response = await axios.put(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    },

    // 5. DELETE Delete Gameshow Quiz
    deleteGame: async (gameId: string) => {
        const response = await axios.delete(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    },

    // 6. GET Play Game (Public)
    playGamePublic: async (gameId: string) => {
        const response = await axios.get(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}/play`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data.data;
    },

    // 7. GET Play Game (Private/Preview)
    playGamePrivate: async (gameId: string) => {
        const response = await axios.get(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}/preview`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data.data;
    },

    // 8. POST Evaluate Quiz Answer
    checkAnswer: async (
        gameId: string,
        payload: CheckAnswerPayload
    ): Promise<CheckAnswerResponse> => {
        const response = await axios.post(
            `${API_BASE}/game/game-list/gameshow-quiz/${gameId}/check`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data.data;
    },
};

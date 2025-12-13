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

export interface GameshowGame {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  questions: GameshowQuestion[];
}

export interface CreateGameshowPayload {
  title: string;
  description?: string;
  thumbnail?: string;
  gameData: {
    questions: {
      id: string;
      text: string;
      timeLimit: number;
      points: number;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
      }[];
    }[];
    randomizeQuestions: boolean;
  };
}

export interface CheckAnswerPayload {
  questionId: string;
  selectedOptionId: string;
  timeTaken?: number;
}

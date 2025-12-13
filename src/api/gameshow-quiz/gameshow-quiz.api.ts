import api from '@/api/axios';
import type {
  CreateGameshowPayload,
  GameshowGameData,
  CheckAnswerPayload,
} from './types';

export const GameshowQuizAPI = {
  // CREATE
  create(payload: CreateGameshowPayload) {
    return api.post('/gameshow-quiz', payload);
  },

  // LIST
  list() {
    return api.get('/gameshow-quiz');
  },

  // DETAIL
  getDetail(id: string) {
    return api.get(`/gameshow-quiz/${id}`);
  },

  // PLAY (PUBLIC)
  play(id: string) {
    return api.get(`/gameshow-quiz/play/${id}`);
  },

  // PREVIEW (CREATOR)
  preview(id: string) {
    return api.get(`/gameshow-quiz/preview/${id}`);
  },

  // CHECK ANSWER
  checkAnswer(gameId: string, payload: CheckAnswerPayload) {
    return api.post(`/gameshow-quiz/${gameId}/evaluate`, payload);
  },

  // UPDATE
  update(id: string, payload: CreateGameshowPayload) {
    return api.put(`/gameshow-quiz/${id}`, payload);
  },

  // DELETE
  delete(id: string) {
    return api.delete(`/gameshow-quiz/${id}`);
  },
};

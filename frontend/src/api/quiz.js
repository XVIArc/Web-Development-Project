import { handleApiResponse } from "./handleResponse";

const BASE = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const quizApi = {
  getQuestions: () =>
    fetch(`${BASE}/quiz/questions`, {
      headers: authHeaders(),
    }).then(handleApiResponse),

  submit: ({ answers }) =>
    fetch(`${BASE}/quiz/submit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ answers }),
    }).then(handleApiResponse),

  getLeaderboard: () =>
    fetch(`${BASE}/quiz/leaderboard`).then(handleApiResponse),

  getAttempts: () =>
    fetch(`${BASE}/quiz/attempts`, {
      headers: authHeaders(),
    }).then(handleApiResponse),
};

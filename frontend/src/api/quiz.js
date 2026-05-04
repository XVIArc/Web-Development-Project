const BASE = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Something went wrong");
  return data.data;
};

export const quizApi = {
  getQuestions: () =>
    fetch(`${BASE}/quiz/questions`, {
      headers: authHeaders(),
    }).then(handle),

  submit: ({ answers }) =>
    fetch(`${BASE}/quiz/submit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ answers }),
    }).then(handle),

  getLeaderboard: () =>
    fetch(`${BASE}/quiz/leaderboard`).then(handle),

  getAttempts: () =>
    fetch(`${BASE}/quiz/attempts`, {
      headers: authHeaders(),
    }).then(handle),
};

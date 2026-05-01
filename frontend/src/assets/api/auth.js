const mockQuestions = [
  {
    _id: "1",
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
  },
  {
    _id: "2",
    text: "Capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctIndex: 2,
  },
  {
    _id: "3",
    text: "What color is the sky?",
    options: ["Green", "Blue", "Red", "Yellow"],
    correctIndex: 1,
  },
];

export const quizApi = {
  getQuestions: async () => mockQuestions,
  submit: async ({ answers }) => ({ score: 2, total: 3 }),
  getLeaderboard: async () => [
    { username: "alice", score: 10 },
    { username: "bob", score: 8 },
    { username: "user", score: 6 },
  ],
  getAttempts: async () => [
    { _id: "1", score: 2, total: 3, createdAt: new Date().toISOString() },
  ],
};
//MOCK

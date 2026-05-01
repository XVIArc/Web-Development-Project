let mockQuestions = [
  {
    _id: "1",
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    active: true,
  },
  {
    _id: "2",
    text: "Capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctIndex: 2,
    active: true,
  },
];

export const adminApi = {
  getQuestions: async () => mockQuestions,
  createQuestion: async (data) => {
    const q = { ...data, _id: Date.now().toString(), active: true };
    mockQuestions.push(q);
    return q;
  },
  updateQuestion: async (id, data) => {
    mockQuestions = mockQuestions.map((q) =>
      q._id === id ? { ...q, ...data } : q,
    );
    return mockQuestions.find((q) => q._id === id);
  },
  deleteQuestion: async (id) => {
    mockQuestions = mockQuestions.filter((q) => q._id !== id);
  },
  toggleQuestion: async (id) => {
    mockQuestions = mockQuestions.map((q) =>
      q._id === id ? { ...q, active: !q.active } : q,
    );
    return mockQuestions.find((q) => q._id === id);
  },
  bulkImport: async ({ questions }) => {
    const added = questions.map((q, i) => ({
      ...q,
      _id: `bulk-${i}`,
      active: true,
    }));
    mockQuestions = [...mockQuestions, ...added];
    return added;
  },
};
//MOCK

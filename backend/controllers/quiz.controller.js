const Question = require('../models/Question');
const Score = require('../models/Score');

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ active: true });
    const shuffled = shuffle(questions).slice(0, 10); // 6-10 questions
    res.json({ success: true, data: shuffled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedAnswer }]
    const ids = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: ids } });
    const qMap = Object.fromEntries(questions.map(q => [q._id.toString(), q]));

    const scored = answers.map(a => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: qMap[a.questionId]?.correctAnswer === a.selectedAnswer,
    }));

    const score = scored.filter(a => a.isCorrect).length;

    await Score.create({ userId: req.user.id, score, answers: scored });

    res.json({ success: true, data: { score, total: answers.length, answers: scored } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'username')
      .sort({ score: -1 })
      .limit(20);
    res.json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await Score.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

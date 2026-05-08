const Question = require("../models/Question");
const Score = require("../models/Score");

// Fisher-Yates, returns a new array, doesn't touch the original
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// GET /api/quiz/questions  (req.user comes from auth middleware)
const getQuestions = async (req, res) => {
  try {
    const active = await Question.find({ active: true });

    if (active.length < 6) {
      return res.status(503).json({
        success: false,
        error: "Not enough active questions (minimum 6 required)",
      });
    }

    // shuffle first, then take up to 10, keeps every attempt feeling different
    const questions = shuffle(active).slice(0, Math.min(10, active.length));

    // never send correctIndex to the client
    const sanitized = questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
    }));

    res.json({ success: true, data: sanitized });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/quiz/submit  (req.user comes from auth middleware)
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedIndex }]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "answers array is required" });
    }

    // one DB call to get all the questions at once
    const ids = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: ids } });
    const qMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));

    let score = 0;
    const scoredAnswers = answers.map((a) => {
      const q = qMap[a.questionId];
      const isCorrect = !!(q && a.selectedIndex === q.correctIndex);
      if (isCorrect) score++;
      return { questionId: a.questionId, selectedIndex: a.selectedIndex, isCorrect };
    });

    // store username directly so leaderboard reads don't need a populate()
    await Score.create({
      userId: req.user.id,
      username: req.user.username,
      score,
      total: answers.length,
      answers: scoredAnswers,
    });

    res.json({ success: true, data: { score, total: answers.length } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/quiz/leaderboard  (public)
// Aggregate so each user appears once with their personal best score.
const getLeaderboard = async (req, res) => {
  try {
    const entries = await Score.aggregate([
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          score: { $max: "$score" },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, username: 1, score: 1 } },
    ]);

    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/quiz/attempts  (req.user comes from auth middleware)
const getAttempts = async (req, res) => {
  try {
    const attempts = await Score.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("score total createdAt");

    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getQuestions, submitQuiz, getLeaderboard, getAttempts };

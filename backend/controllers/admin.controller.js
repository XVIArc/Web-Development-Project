const Question = require("../models/Question");

// GET /api/admin/questions
const getQuestions = async (req, res) => {
  try {
    // include inactive ones, admin needs to see everything
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/questions
const createQuestion = async (req, res) => {
  try {
    const { text, options, correctIndex } = req.body;

    if (
      !text ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      correctIndex === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "text, exactly 4 options, and correctIndex are required",
      });
    }

    const question = await Question.create({ text, options, correctIndex });
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/admin/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const { text, options, correctIndex } = req.body;

    if (options && options.length !== 4) {
      return res
        .status(400)
        .json({ success: false, error: "Exactly 4 options required" });
    }

    // runValidators makes sure the model-level options check still fires
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { text, options, correctIndex },
      { returnDocument: "after", runValidators: true },
    );

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/admin/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH /api/admin/questions/:id/toggle
const toggleQuestion = async (req, res) => {
  try {
    // fetch then save instead of findByIdAndUpdate so validators still run
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    question.active = !question.active;
    await question.save();

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/admin/questions/bulk
const bulkImport = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "questions array is required" });
    }

    // validate everything before touching the DB, easier to fix and retry
    // if the whole batch gets rejected with the bad indices listed
    const invalid = questions
      .map((q, i) => ({ q, i }))
      .filter(
        ({ q }) =>
          !q.text ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          q.correctIndex === undefined,
      );

    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        error: `${invalid.length} question(s) failed validation`,
        data: invalid.map(({ i }) => i),
      });
    }

    const inserted = await Question.insertMany(
      questions.map((q) => ({ ...q, active: true })),
    );

    res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestion,
  bulkImport,
};

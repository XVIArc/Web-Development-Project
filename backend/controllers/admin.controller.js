const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.toggleQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found' });
    question.active = !question.active;
    await question.save();
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) return res.status(400).json({ success: false, error: 'questions must be an array' });
    const inserted = await Question.insertMany(questions, { ordered: false });
    res.status(201).json({ success: true, data: { inserted: inserted.length } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

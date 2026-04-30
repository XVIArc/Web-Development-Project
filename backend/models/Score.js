const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: { type: Number, required: true }, // index into options
  isCorrect:      { type: Boolean, required: true },
}, { _id: false });

const scoreSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score:     { type: Number, required: true },
  answers:   { type: [answerSchema], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);

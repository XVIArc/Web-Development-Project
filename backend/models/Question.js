const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text:          { type: String, required: true },
  options:       { type: [String], required: true, validate: v => v.length === 4 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }, // index into options
  active:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);

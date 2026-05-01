const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedIndex: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Score", scoreSchema);

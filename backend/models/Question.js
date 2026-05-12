const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    imageUrl:
    {
        type: String,
        trim: true,
        default:"",
        },
    options: {
      type: [String],
      validate: (v) => v.length === 4,
      required: true,
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Question", questionSchema);

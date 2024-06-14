// models/Answer.js
import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  answer: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);

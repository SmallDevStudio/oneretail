// models/UserQuiz.js
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true }
});

const userQuizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scores: [scoreSchema] // เก็บประวัติคะแนน
});

export default mongoose.models.UserQuiz || mongoose.model('UserQuiz', userQuizSchema);

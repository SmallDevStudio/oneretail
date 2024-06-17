// models/QuizGroup.js
import mongoose from 'mongoose';

const quizGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.QuizGroup || mongoose.model('QuizGroup', quizGroupSchema);

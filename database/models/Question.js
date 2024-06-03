import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
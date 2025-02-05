import mongoose from "mongoose";

const ExamQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: true },
    description: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: String },
    active: { type: Boolean, default: true },
},{ timestamps: true });

export default mongoose.models.ExamQuestions || mongoose.model('ExamQuestions', ExamQuestionsSchema);
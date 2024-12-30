import mongoose from "mongoose";

const ReviewQuizSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    question: { type: String, required: true },
    description: { type: String },
    options: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.ReviewQuiz || mongoose.model('ReviewQuiz', ReviewQuizSchema);
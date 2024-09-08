import mongoose from 'mongoose';

const examAnswerSchema = new mongoose.Schema({
    examId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Examination'}],
    userId: { type: String, ref: 'Users', required: true },
    answerCount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ExamAnswer || mongoose.model('ExamAnswer', examAnswerSchema);
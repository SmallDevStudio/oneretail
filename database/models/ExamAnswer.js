import mongoose from 'mongoose';

const examAnswerSchema = new mongoose.Schema({
    exams: [{ 
        questionId: {type: String},
        answer: {type: Number},
        isCorrect: {type: Boolean}
    }],
    userId: { type: String, ref: 'Users', required: true },
}, { timestamps: true });

export default mongoose.models.ExamAnswer || mongoose.model('ExamAnswer', examAnswerSchema);
import mongoose from "mongoose";

const QuestionnairesSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    question: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewQuiz', required: true },
        answer: { type: String, required: true },
    }],
    suggestion: { type: String},
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Questionnaires || mongoose.model('Questionnaires', QuestionnairesSchema);
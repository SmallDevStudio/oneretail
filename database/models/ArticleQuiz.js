import mongoose from 'mongoose';

const ArticleQuizSchema = new mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ArticleQuiz || mongoose.model('ArticleQuiz', ArticleQuizSchema);
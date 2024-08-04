import mongoose from 'mongoose';

const ArticleQuizSchema = new mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    question: [
        {
            question: String,
            options: [String],
            correctAnswer: Number,
        }
    ],
}, { timestamps: true });

export default mongoose.models.ArticleQuiz || mongoose.model('ArticleQuiz', ArticleQuizSchema);
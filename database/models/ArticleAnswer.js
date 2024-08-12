import mongoose from 'mongoose';

const articleAnswerSchema = new mongoose.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    userId: { type: String, ref: 'Users', required: true },
    isAnswer: { type: String },
    answer: { type: Boolean, default: false },
    point: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ArticleAnswer || mongoose.model('ArticleAnswer', articleAnswerSchema);
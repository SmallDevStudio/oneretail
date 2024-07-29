import mongoose from 'mongoose';

const ArticleCommentsSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  userId: { type: String, ref: 'Users', required: true },
  comment: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
}, { timestamps: true });

export default mongoose.models.ArticleComments || mongoose.model('ArticleComments', ArticleCommentsSchema);
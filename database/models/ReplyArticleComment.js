import mongoose from 'mongoose';

const ReplyArticleCommentsSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleComments', required: true },
  userId: { type: String, ref: 'Users', required: true },
  likes: { type: Number, default: 0 },
  reply: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ReplyArticleComments || mongoose.model('ReplyArticleComments', ReplyArticleCommentsSchema);
import mongoose from 'mongoose';

const ReplyContentCommentsSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentComment', required: true },
  userId: { type: String, ref: 'Users', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  reply: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ReplyContentComments || mongoose.model('ReplyContentComments', ReplyContentCommentsSchema);
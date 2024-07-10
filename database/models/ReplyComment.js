import mongoose from 'mongoose';

const ReplyCommentsSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  userId: { type: String, ref: 'Users', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  reply: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ReplyComments || mongoose.model('ReplyComments', ReplyCommentsSchema);
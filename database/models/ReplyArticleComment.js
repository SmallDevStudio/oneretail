import mongoose from 'mongoose';

const ReplyArticleCommentsSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  reply: { type: String },
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  files: [{ public_id: { type: String }, url: { type: String } }],
  tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
  likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
  userId: { type: String, ref: 'Users', required: true },
}, { timestamps: true });

export default mongoose.models.ReplyArticleComments || mongoose.model('ReplyArticleComments', ReplyArticleCommentsSchema);
import mongoose from 'mongoose';

const ReplyContentCommentsSchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentComments', required: true },
  reply: { type: String },
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  files: [{ public_id: { type: String }, url: { type: String } }],
  tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
  likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
  userId: { type: String, ref: 'Users', required: true },
}, { timestamps: true });

export default mongoose.models.ReplyContentComments || mongoose.model('ReplyContentComments', ReplyContentCommentsSchema);
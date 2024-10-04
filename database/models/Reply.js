import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  reply: { type: String },
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  files: [{ public_id: { type: String }, url: { type: String } }],
  tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
  sticker: {
    public_id: { type: String },
    url: { type: String },
    type: { type: String }
  },
  likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
  userId: { type: String, ref: 'Users', required: true },
}, { timestamps: true });

export default mongoose.models.Reply || mongoose.model('Reply', ReplySchema);
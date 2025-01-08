import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  members: [{ type: String, required: true }], // userId
  groupName: { type: String, default: null }, // null สำหรับ 1-1 chat
  groupPicture: { type: String, default: null },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String }, // null ในกรณี Group Chat
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: String }], // User IDs ของคนที่อ่านข้อความ
  });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
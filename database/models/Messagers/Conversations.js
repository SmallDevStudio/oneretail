import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    creator: { type: String, ref: 'Users', required: true },
    channelId: { type: String, ref: 'Channels', required: true },
    type: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true
});

export default mongoose.models.Conversations || mongoose.model('Conversations', ConversationSchema);
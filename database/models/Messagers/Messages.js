import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversations', required: true },
    senderId: { type: String, ref: 'Users', required: true },
    type: { type: String },
    message: { type: String },
    media: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
    files: [{ public_id: { type: String }, url: { type: String } }],
    Sticker: {
        public_id: { type: String },
        url: { type: String },
        type: { type: String }
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true
});

export default mongoose.models.Messages || mongoose.model('Messages', MessagesSchema);
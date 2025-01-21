import mongoose from "mongoose";

const ParticipantsSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversations', required: true },
    userId: [{ type: String, ref: 'Users', required: true }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true
});

export default mongoose.models.Participants || mongoose.model('Participants', ParticipantsSchema);
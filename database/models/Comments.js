import mongoose, { Schema } from "mongoose";

const CommentsSchema = new mongoose.Schema({
    comment: { type: String, required: true, },
    contentId: { type: String, required: true, },
    userId: { type: String, required: true, },
    userImage: { type: String, required: true, },
    createdAt: { type: Date, default: Date.now, },
});

export default mongoose.models.Comments || mongoose.model('Comments', CommentsSchema);
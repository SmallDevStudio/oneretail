import mongoose from "mongoose";

const pinPostSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: String, ref: 'Users', required: true },
    pinned: { type: Boolean, default: true },
}, {
    timestamps: true
});

export default mongoose.models.PinPost || mongoose.model('PinPost', pinPostSchema);

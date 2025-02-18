import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    userId: { type: String, ref: 'Users'},
    anonymous: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Share || mongoose.model('Share', ShareSchema);
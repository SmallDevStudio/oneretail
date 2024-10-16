import mongoose from "mongoose";

const GenContentsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    contentGenId: { type: String, ref: 'ContentGen', required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GenContents || mongoose.model('GenContents', GenContentsSchema)
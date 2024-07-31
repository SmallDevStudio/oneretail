import mongoose from "mongoose";

const contentViewsSchema = new mongoose.Schema({
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContentViews || mongoose.model('ContentViews', contentViewsSchema);
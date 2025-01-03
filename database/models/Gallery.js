import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    driveUrl: { type: String, required: true },
    creator: { type: String, ref: 'Users', required: true },
}, {
    timestamps: true
});

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    googleDriveUrl: { type: String },
    subfolder: [{
        title: { type: String },
        description: { type: String },
        googleDriveUrl: { type: String},
        keywords: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    keywords: { type: [String], default: [] },
    creator: { type: String, ref: 'Users', required: true },
}, {
    timestamps: true
});

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
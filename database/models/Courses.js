import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    group: { type: String },
    active: { type: Boolean, default: true },
    driveUrl: { type: String },
    galleryId: { type: String, ref: 'Gallery' },
    questionnairesActive: { type: Boolean, default: true },
    creator: { type: String, ref: 'Users', required: true },
}, { timestamps: true });

export default mongoose.models.Courses || mongoose.model('Courses', coursesSchema);
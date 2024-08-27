import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    page: { type: String, required: true },
    action: { type: String, required: true },
    referId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema);
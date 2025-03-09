import mongoose from "mongoose";

const UserLogSchema = new mongoose.Schema({
        userId: { type: String, ref: 'Users', required: true },
        targetId: { type: String, ref: 'Users', required: true },
        action: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    });
    
export default mongoose.models.UserLog || mongoose.model('UserLog', UserLogSchema);
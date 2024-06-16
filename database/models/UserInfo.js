import mongoose from "mongoose";

const UserInfoSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Users' },
    totalPoints: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
});

export default mongoose.models.UserInfo || mongoose.model('UserInfo', UserInfoSchema);
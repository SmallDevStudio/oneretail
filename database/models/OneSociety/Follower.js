import mongoose from "mongoose";

const FollowerSchema = new mongoose.Schema({
        userId: { type: String, ref: 'Users', required: true },
        targetId: { type: String, ref: 'Users', required: true },
        type: { type: String, enum: ['follow', 'unfollow'], default: 'follow' },
        friends: { type: String, enum: ['yes', 'no'], default: 'no' }, // เพิ่ม field friends
    }, {
        timestamps: true
    });
    
export default mongoose.models.Follower || mongoose.model('Follower', FollowerSchema);
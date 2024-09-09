import mongoose from 'mongoose';

const UserBadgesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    badgeId: { type: String, required: true },
},{ timestamps: true });

export default mongoose.models.UserBadges || mongoose.model('UserBadges', UserBadgesSchema);
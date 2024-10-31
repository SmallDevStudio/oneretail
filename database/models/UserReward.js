// models/UserReward.js
import mongoose from 'mongoose';

const UserRewardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  day: { type: Number, required: true },
  points: { type: Number, required: true },
});

export default mongoose.models.UserReward || mongoose.model('UserReward', UserRewardSchema);

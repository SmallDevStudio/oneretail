import mongoose from 'mongoose';

const LoginRewardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  day: { type: Number, required: true },
  lastLogin: { type: Date, required: true }
});

export default mongoose.models.LoginReward || mongoose.model('LoginReward', LoginRewardSchema);
import mongoose from 'mongoose';

const UserRewardSchema = new mongoose.Schema({
  userId: { type: String, ref: 'Users', required: true, unique: true },
  dayLogged: { type: Number, required: true, default: 0 },
  lastRewardDate: { type: Date, default: null },
});

export default mongoose.models.UserReward || mongoose.model('UserReward', UserRewardSchema);

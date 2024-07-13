import mongoose from 'mongoose';

const LoginRewardSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  day: { type: Number, required: true },
  lastLogin: { type: Date, required: true },
  daysLogged: { type: [Number], default: [] }
});

export default mongoose.models.LoginReward || mongoose.model('LoginReward', LoginRewardSchema);

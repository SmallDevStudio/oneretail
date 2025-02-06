import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
  userId: { type: String, ref: 'Users', required: true },
  date: { type: Date, default: Date.now },
  points: { type: Number, required: true },
});

export default mongoose.models.Reward || mongoose.model('Reward', RewardSchema);

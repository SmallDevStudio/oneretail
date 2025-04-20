import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  userId: { type: String, ref: "Users", required: true },
  claim: [
    {
      date: { type: Date, default: Date.now },
      points: { type: Number, required: true },
    },
  ],
  dayLogged: { type: Number, default: 0 },
  lastRewardDate: Date,
  lastResetDate: Date,
});

export default mongoose.models.Reward || mongoose.model("Reward", RewardSchema);

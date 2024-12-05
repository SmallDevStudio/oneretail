import mongoose from "mongoose";

const RockPaperScissorsGameSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    cpu: { type: Number, required: true },
    round: { type: Number, required: true },
    isWin: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RockPaperScissorsGame || mongoose.model('RockPaperScissorsGame', RockPaperScissorsGameSchema);
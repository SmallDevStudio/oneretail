import mongoose from "mongoose";

const CoinsSchema = new mongoose.Schema({
    userId: { type: String, required: true, },
    descriptions: { type: String,},
    type: { type: String, required: true, },
    coins: { type: Number, required: true, },
    createdAt: { type: Date, default: Date.now, },
});

export default mongoose.models.CoinsSchema || mongoose.model('Coins', CoinsSchema);
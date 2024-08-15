import mongoose from "mongoose";

const CoinsSchema = new mongoose.Schema({
    userId: { type: String, required: true, },
    description: { type: String,},
    referId: { type: String },
    path: { type: String },
    subpath: { type: String },
    type: { type: String, required: true, },
    coins: { type: Number, required: true, },
    createdAt: { type: Date, default: Date.now, },
});

export default mongoose.models.Coins || mongoose.model('Coins', CoinsSchema);
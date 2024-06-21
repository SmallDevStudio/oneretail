import mongoose from 'mongoose';

const MemoryGameSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    moves: { type: Number, required: true },
    score: { type: Number, required: true },
    timeLeft: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MemoryGame || mongoose.model('MemoryGame', MemoryGameSchema);

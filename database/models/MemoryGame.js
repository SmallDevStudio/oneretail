import mongoose from 'mongoose';

const MemoryGameSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    moves: { type: Number },
    score: { type: Number, required: true },
    timeLeft: { type: Number },
    complete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MemoryGame || mongoose.model('MemoryGame', MemoryGameSchema);

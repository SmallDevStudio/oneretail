import mongoose from "mongoose";

const RamdomsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    point: { type: Number, required: true },
    campaign: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ramdoms || mongoose.model('Ramdoms', RamdomsSchema);
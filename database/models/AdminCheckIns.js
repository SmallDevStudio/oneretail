import mongoose from "mongoose";

const AdminCheckInsSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    userId: { type: String, ref: 'Users', required: true },
    on: { type: Boolean, default: false },
    point: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.AdminCheckIns || mongoose.model('AdminCheckIns', AdminCheckInsSchema);
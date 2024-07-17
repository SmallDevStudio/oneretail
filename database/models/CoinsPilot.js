import mongoose, { Schema } from "mongoose";

const CoinsPilotSchema = new Schema({
    userId: { type: String, required: true },
    loginDate: { type: Date, required: true },
}, {
    timestamps: true
});

const CoinsPilot = mongoose.models.CoinsPilot || mongoose.model('CoinsPilot', CoinsPilotSchema);

export default CoinsPilot;

import mongoose from "mongoose";

const adsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    media: { public_id: { type: String }, url: { type: String }, type: { type: String }},
    url: { type: String },
    status: { type: Boolean, default: true },
    position: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ADS || mongoose.model('ADS', adsSchema);
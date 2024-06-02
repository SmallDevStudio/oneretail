import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
    userId: { type: String, required: true, },
    descriptions: { type: String,},
    type: { type: String, required: true, },
    point: { type: Number, required: true, },
    createdAt: { type: Date, default: Date.now, },
});

export default mongoose.models.PointSchema || mongoose.model('Point', PointSchema);
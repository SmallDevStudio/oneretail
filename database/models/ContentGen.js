import mongoose from "mongoose";

const ContentGenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contents: [{ type: String}],
    level: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    creator: { type: String, ref: 'Users', required: true },
}, {
    timestamps: true
});

export default mongoose.models.ContentGen || mongoose.model('ContentGen', ContentGenSchema);
import mongoose from "mongoose";

const VoteNameSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Users', unique: true },
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.VoteName || mongoose.model('VoteName', VoteNameSchema)
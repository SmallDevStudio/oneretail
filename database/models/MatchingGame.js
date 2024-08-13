import mongoose from "mongoose";

const matchingGameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
    userId: { type: String, ref: 'Users', required: true },
    status: { type: Boolean, default: true },
},{ timestamps: true });

export default mongoose.models.MatchingGame || mongoose.model('MatchingGame', matchingGameSchema);
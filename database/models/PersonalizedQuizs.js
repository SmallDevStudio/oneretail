import mongoose from "mongoose";

const PersonalizedQuizsSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    level: { type: Number, default: 1 },
    group: { type: String },
    position: { type: String },
    active: { type: Boolean, default: true },
    creator: { type: String, ref: 'Users', required: true },
}, {
    timestamps: true
});

export default mongoose.models.PersonalizedQuizs || mongoose.model('PersonalizedQuizs', PersonalizedQuizsSchema);
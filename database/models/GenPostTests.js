import mongoose from "mongoose";

const GenPostTestsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    posttest: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalizedQuizs'},
        answer: { type: String },
        isAnswer: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    finished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.GenPostTests || mongoose.model('GenPostTests', GenPostTestsSchema)
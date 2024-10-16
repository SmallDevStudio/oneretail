import mongoose from "mongoose";

const GenPreTestsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    contentGenId: { type: String, ref: 'ContentGen', required: true },
    pretest: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalizedQuizs'},
        answer: { type: String },
        isCorrect: { type: Boolean, default: false },
    }]
}, { timestamps: true });

export default mongoose.models.GenPreTests || mongoose.model('GenPreTests', GenPreTestsSchema)
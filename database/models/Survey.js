import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
    userId: {type: String, required: true },
    value: { type: Number, required: true },
    memo: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Survey || mongoose.model('Survey', surveySchema);
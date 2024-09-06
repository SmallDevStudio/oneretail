import mongoose from 'mongoose';

const ExaminationSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    group: { type: String },
    position: { type: String },
    isAnswer: { type: Boolean, default: false },
    creator: { type: String, ref: 'Users' },
},{ timestamps: true });

export default mongoose.models.Examination || mongoose.model('Examination', ExaminationSchema);
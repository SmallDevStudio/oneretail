import mongoose from 'mongoose';

const ExaminationSchema = new mongoose.Schema({
    questions: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
    group: { type: String },
    position: { type: String },
    active: { type: Boolean, default: true },
    creator: { type: String, ref: 'Users' },
},{ timestamps: true });

export default mongoose.models.Examination || mongoose.model('Examination', ExaminationSchema);
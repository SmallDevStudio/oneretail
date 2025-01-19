import mongoose from 'mongoose';

const ExaminationsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    group: { type: String },
    position: { type: String },
    active: { type: Boolean, default: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamQuestions' }],
    creator: { type: String, ref: 'Users' },
    isDeleted: { type: Boolean, default: false },
},{ timestamps: true });

export default mongoose.models.Examinations2 || mongoose.model('Examinations2', ExaminationsSchema);
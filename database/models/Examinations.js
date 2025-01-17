import mongoose from 'mongoose';

const ExaminationsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    group: { type: String },
    position: { type: String },
    active: { type: Boolean, default: true },
    ExamQuestionId: [{ type: ObjectId, ref: 'ExamQuestions' }],
    creator: { type: String, ref: 'Users' },
},{ timestamps: true });

export default mongoose.models.Examinations || mongoose.model('Examinations', ExaminationsSchema);
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{type: String }],
    correctAnswer: { type: String, required: true },
    group: { type: String },
    subGroup: { type: String },
},{
    timestamps: true
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
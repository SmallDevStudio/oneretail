import mongoose from "mongoose";

const QuestionnaireCommentsSchema = new mongoose.Schema({
    userId: { type: String, ref: 'Users', required: true },
    questionnaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaires', required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.QuestionnaireComments || mongoose.model('QuestionnaireComments', QuestionnaireCommentsSchema);
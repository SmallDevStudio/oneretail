import mongoose from "mongoose";

const surveyCommentsSchema = new mongoose.Schema({
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    userId: { type: String, ref: 'Users', required: true },
    comment: { type: String, required: true },
    stickers: {
        stickerId: { type: String },
        sticker: { type: String },
    },
    medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
}, {
    timestamps: true
});

export default mongoose.models.SurveyComments || mongoose.model('SurveyComments', surveyCommentsSchema);
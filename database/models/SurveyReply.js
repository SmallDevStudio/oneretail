import mongoose from "mongoose";

const SurveyReplySchema = new mongoose.Schema({
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveyComments', required: true },
    userId: { type: String, ref: 'Users', required: true },
    reply: { type: String },
    sticker: {
        public_id: { type: String },
        url: { type: String },
        type: { type: String }
    },
    medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
}, {
    timestamps: true
});

export default mongoose.models.SurveyReply || mongoose.model('SurveyReply', SurveyReplySchema);
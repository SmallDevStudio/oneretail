import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    userId: { type: String, required: true },
    optionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
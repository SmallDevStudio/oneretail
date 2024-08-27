import mongoose from "mongoose";

const satisfactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    satisfied: { type: Number},
    recommend: { type: String},
    featureLike: [{ type: String}],
    improved: [{ type: String}],
    featuresAdd: { type: String},
    problems: { type: String},
    suggestions: { type: String},
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Satisfaction || mongoose.model('Satisfaction', satisfactionSchema);
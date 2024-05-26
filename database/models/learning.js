import mongoose, { Schema } from "mongoose";

const LearningSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    youtubeUrl: { type: String},
    thumbnailUrl: { type: String},
    caterogy: { type: String, default: '' },
    subCaterogy: { type: String, default: '' },
    point: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    loves: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    options: { type: Array, default: [] },
    publicsher: { type: Boolean, default: true },
    pageCount: { type: Number, default: 0 },
    user_created_id: { type: String, },
}, {
    timestamps: true
});

const Learning = mongoose.models.Learning || mongoose.model('Learning', LearningSchema);

export default Learning;
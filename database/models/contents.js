import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String },
    youtubeUrl: { type: String },
    videoId: { type: String },
    thumbnailUrl: { type: String },
    duration: { type: String },
    durationMinutes: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    subcategory: { type: Schema.Types.ObjectId, ref: 'subcategories' },
    group: { type: Schema.Types.ObjectId, ref: 'groups' },
    options: { type: Array },
    author: { type: String, required: true },
    publisher: { type: Boolean, default: true },
    point: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    tags: { type: String },
}, {
    timestamps: true
});

const Contents = mongoose.models.contents || mongoose.model('contents', contentSchema);

export default Contents;
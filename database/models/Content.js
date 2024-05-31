import mongoose, { Schema } from "mongoose";

const ContentSchema = new Schema({
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    slug: { type: String, unique: true, },
    youtubeUrl: { type: String, },
    videoId: { type: String, },
    thumbnailUrl: { type: String, },
    duration: { type: String, },
    category: { type: String, },
    subcategory: { type: String, },
    groups: { type: String, },
    author: { type: String, },
    publisher: { type: Boolean, default: true, },
    point: { type: Number, default: 0, },
    coins: { type: Number, default: 0, },
    views: { type: Number, default: 0,},
    like: { type: Number, default: 0, },
    tags: { type: [String], },
}, {
    timestamps: true
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
import mongoose, { Schema } from "mongoose";

const ContentSchema = new Schema({
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    slug: { type: String, unique: true, },
    youtubeUrl: { type: String, },
    thumbnailUrl: { type: String, },
    categories: { type: Schema.Types.ObjectId, ref: 'categories', },
    subcategories: { type: Schema.Types.ObjectId, ref: 'subcategories', },
    groups: { type: Schema.Types.ObjectId, ref: 'Group', },
    author: { type: String, },
    publisher: { type: Boolean, default: true, },
    point: { type: Number, default: 0, },
    coins: { type: Number, default: 0, },
    views: { type: Number, default: 0,},
    like: { type: Number, default: 0, },
    tags: { type: String, },
}, {
    timestamps: true
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
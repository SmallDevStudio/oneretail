import { duration } from "@mui/material";
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
    caterogy: { type: String },
    subcaterogy: { type: String },
    options: { type: Array },
    author: { type: Schema.Types.ObjectId, ref: 'users' },
    publisher: { type: Boolean, default: true },
    point: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    tags: { type: Array },
}, {
    timestamps: true
});

const Contents = mongoose.models.contents || mongoose.model('contents', contentSchema);

export default Contents;
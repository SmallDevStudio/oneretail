import mongoose, { Schema } from "mongoose";

const leaningSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String},
    thumbnailUrl: { type: String},
    content: { type: String, required: true },
    caterogy: { type: String, default: undefined },
    subCaterogy: { type: String, default: undefined },
    point: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    loves: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    options: { type: Array, default: [] },
    publicsher: { type: Boolean, default: true },
    pageCount: { type: Number, default: 0 },
    employee_id: { type: String, required: true },
}, {
    timestamps: true
});

const Leaning = mongoose.models.leaning || mongoose.model('leaning', leaningSchema);

export default Leaning;
import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    caterogy_id: { type: Schema.Types.ObjectId, ref: 'caterogy' },
    icon: { type: String },
    image: { type: String },
    note: { type: String },
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});

const SubCategory = mongoose.models.subcaterogy || mongoose.model('subcaterogy', subCategorySchema);

export default SubCategory;
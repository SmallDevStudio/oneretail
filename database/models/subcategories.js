import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Subcategory = mongoose.models.Subcategory || mongoose.model('subcategories', subCategorySchema);

export default Subcategory;
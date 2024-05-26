import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    image: { type: String },
    color: { type: String },
    note: { type: String },
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});

const subCategorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    caterogy_id: { type: Schema.Types.ObjectId, ref: 'caterogy' },
    icon: { type: String },
    image: { type: String },
    color: { type: String },
    note: { type: String },
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});

const Category = mongoose.models.caterogy || mongoose.model('caterogy', categorySchema);
const SubCategory = mongoose.models.subcaterogy || mongoose.model('subcaterogy', subCategorySchema);


// eslint-disable-next-line import/no-anonymous-default-export
export default {Category, SubCategory};
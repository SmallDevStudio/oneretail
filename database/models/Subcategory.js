import mongoose, { Schema } from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
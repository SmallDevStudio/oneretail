import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  title: { type: String, required: true,},
  subtitle: {type: String,},
  createdAt: {type: Date, default: Date.now,},
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
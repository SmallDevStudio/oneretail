import mongoose from "mongoose";

const NewsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NewsCategory ||
  mongoose.model("NewsCategory", NewsCategorySchema);

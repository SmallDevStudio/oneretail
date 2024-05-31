import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Category =  mongoose.models.Category || mongoose.model('categories', CategorySchema);

  export default Category;
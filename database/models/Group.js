import mongoose, { Schema } from "mongoose";

const GroupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
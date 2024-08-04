import mongoose, { Schema } from "mongoose";

const SubGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now},
  });
  
  export default mongoose.models.SubGroup || mongoose.model('SubGroup', SubGroupSchema);
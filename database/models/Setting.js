import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    survey: { type: Boolean, default: true },
    quiz: { type: String, default: null },
  });
  
  export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
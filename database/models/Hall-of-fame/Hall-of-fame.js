import mongoose from "mongoose";

const HallOfFameSchema = new mongoose.Schema({
  position: { type: String },
  empId: { type: String },
  name: { type: String },
  branch: { type: String },
  zone: { type: String },
  region: { type: String },
  achieve: { type: Number },
  rating: { type: String },
  rank: { type: Number },
  arrow: { type: String },
  rewerdtype: { type: String },
  month: { type: Number },
  year: { type: Number },
});

export default mongoose.models.HallOfFame ||
  mongoose.model("HallOfFame", HallOfFameSchema);

import mongoose from "mongoose";

const TeamGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.TeamGroup ||
  mongoose.model("TeamGroup", TeamGroupSchema);

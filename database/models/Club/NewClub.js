import mongoose from "mongoose";

const NewClubSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    empId: { type: String, ref: "Emp", required: true },
    name: { type: String, required: true },
    position: { type: String },
    team: { type: String },
    branch: { type: String },
    zone: { type: String },
    region: { type: String },
    achieve: { type: Number },
    kpi: { type: Number },
    rating: { type: String },
    rank: { type: Number },
    arrow: { type: String },
    rewerdtype: { type: String },
    month: { type: String },
    year: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.NewClub ||
  mongoose.model("NewClub", NewClubSchema);

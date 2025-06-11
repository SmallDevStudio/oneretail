import mongoose from "mongoose";

const GetPointsSchema = new mongoose.Schema({
  halloffameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HallOfFame",
    required: true,
  },
  userId: { type: String, required: true },
  points: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GetPoints ||
  mongoose.model("GetPoints", GetPointsSchema);

import mongoose from "mongoose";

const PerfActivitySchema = new mongoose.Schema({
  userId: { type: String, ref: "Users", required: true },
  createdAt: { type: Date, default: Date.now },
});

PerfActivitySchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.models.PerfActivity ||
  mongoose.model("PerfActivity", PerfActivitySchema);

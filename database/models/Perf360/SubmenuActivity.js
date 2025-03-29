import mongoose from "mongoose";

const SubmenuActivitySchema = new mongoose.Schema({
  submenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubMenu",
    required: true,
  },
  userId: { type: String, ref: "Users", required: true },
  activity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

SubmenuActivitySchema.index({
  submenuId: 1,
  userId: 1,
  activity: 1,
  createdAt: -1,
});

export default mongoose.models.SubmenuActivity ||
  mongoose.model("SubmenuActivity", SubmenuActivitySchema);

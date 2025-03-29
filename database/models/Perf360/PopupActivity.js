import mongoose from "mongoose";

const PopupActivitySchema = new mongoose.Schema({
  popupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Popup",
    required: true,
  },
  userId: { type: String, ref: "Users", required: true },
  activity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

PopupActivitySchema.index({
  popupId: 1,
  userId: 1,
  activity: 1,
  createdAt: -1,
});

export default mongoose.models.PopupActivity ||
  mongoose.model("PopupActivity", PopupActivitySchema);

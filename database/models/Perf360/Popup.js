import mongoose from "mongoose";

const PopupSchema = new mongoose.Schema(
  {
    group: [{ type: String }],
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    title: { type: String },
    content: { type: String },
    url: { type: String },
    creator: { type: String, ref: "Users", required: true },
    updated_users: [
      {
        userId: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    image: { type: Array, default: {} },
    active: { type: Boolean, default: true },
    views: [
      {
        userId: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Popup || mongoose.model("Popup", PopupSchema);

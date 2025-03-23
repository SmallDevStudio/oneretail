import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    order: { type: Number },
    group: [{ type: String }],
    title: { type: String },
    descriptions: { type: String },
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

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);

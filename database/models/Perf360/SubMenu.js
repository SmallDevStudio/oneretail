import mongoose from "mongoose";

const SubMenuSchema = new mongoose.Schema(
  {
    order: { type: Number },
    menu: { type: String, ref: "Menu", required: true },
    group: { type: String },
    title: { type: String },
    descriptions: { type: String },
    url: { type: String },
    creator: { type: String, ref: "Users", required: true },
    updated_users: [
      {
        userId: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    image: { public_id: { type: String }, url: { type: String } },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SubMenu ||
  mongoose.model("SubMenu", SubMenuSchema);

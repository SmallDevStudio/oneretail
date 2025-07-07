import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    position: { type: String },
    active: { type: Boolean, default: true },
    updated_users: [
      {
        userId: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    creator: { type: String, ref: "Users", required: true },
    deleted: { type: Boolean, default: false },
    delete_user: {
      userId: { type: String },
      deletedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model("News", newsSchema);

import mongoose from "mongoose";

const news1Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    group: { type: String },
    display: { type: String },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
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

export default mongoose.models.News1 || mongoose.model("News1", news1Schema);

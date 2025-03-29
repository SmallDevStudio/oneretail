import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    group: [{ type: String }],
    category: { type: String },
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
    image: { public_id: { type: String }, url: { type: String } },
    display: { type: String },
    position: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);

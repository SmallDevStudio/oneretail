import mongoose from "mongoose";

const { Schema } = mongoose;

const news1Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: Schema.Types.Mixed },
    images: [{ type: Schema.Types.Mixed }],
    video: [{ type: Schema.Types.Mixed }],
    files: [{ type: Schema.Types.Mixed }],
    group: { type: String },
    tab: { type: String },
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
    likes: [
      {
        userId: { type: String, ref: "Users" },
        createAt: { type: Date, default: Date.now },
      },
    ],
    deleted: { type: Boolean, default: false },
    delete_user: {
      userId: { type: String },
      deletedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.models.News1 || mongoose.model("News1", news1Schema);

import mongoose from "mongoose";

const newCommentsSchema = new mongoose.Schema(
  {
    comment: { type: String },
    medias: [
      {
        public_id: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
    files: [{ public_id: { type: String }, url: { type: String } }],
    tagusers: [
      { userId: { type: String, ref: "Users" }, fullname: { type: String } },
    ],
    sticker: {
      public_id: { type: String },
      url: { type: String },
      type: { type: String },
    },
    userId: { type: String, ref: "Users", required: true },
    likes: [
      {
        userId: { type: String, ref: "Users" },
        createAt: { type: Date, default: Date.now },
      },
    ],
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News1",
      required: true,
    },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "NewsReply" }],
  },
  { timestamps: true }
);

export default mongoose.models.NewComments ||
  mongoose.model("NewComments", newCommentsSchema);

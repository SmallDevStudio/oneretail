import mongoose from "mongoose";

const PostViewLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    publicId: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    duration: { type: Number }, // milliseconds
    startTime: { type: Date },
    endTime: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.PostViewLog ||
  mongoose.model("PostViewLog", PostViewLogSchema);

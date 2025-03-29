import mongoose from "mongoose";

const NewsActivitySchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
    required: true,
  },
  userId: { type: String, ref: "Users", required: true },
  activity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

NewsActivitySchema.index({
  newsId: 1,
  userId: 1,
  activity: 1,
  createdAt: -1,
});

export default mongoose.models.NewsActivity ||
  mongoose.model("NewsActivity", NewsActivitySchema);

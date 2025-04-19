import mongoose from "mongoose";

const UseEbookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ebooks",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UseEbook ||
  mongoose.model("UseEbook", UseEbookSchema);

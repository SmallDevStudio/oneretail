import mongoose from "mongoose";

const ReadWelcomeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ReadWelcome ||
  mongoose.model("ReadWelcome", ReadWelcomeSchema);

import mongoose from "mongoose";

const SentPointCoinsSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "Users" },
  trans: { type: String, required: true }, // empId of the recipient
  ref: { type: String, required: true }, // Reference ID for the transaction
  point: { type: Number, required: false },
  coins: { type: Number, required: false },
  remark: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SentPointCoins ||
  mongoose.model("SentPointCoins", SentPointCoinsSchema);

import mongoose from "mongoose";

const BudgetGiftsSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    rh: { type: String },
    zone: { type: String },
    br: { type: String },
    budget: { type: Number, required: true },
    permission: {
      user1: {
        userId: { type: String, ref: "Users" },
        status: { type: Boolean, default: false },
      },
      user2: {
        userId: { type: String, ref: "Users" },
        status: { type: Boolean, default: false },
      },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.BudgetGifts ||
  mongoose.model("BudgetGifts", BudgetGiftsSchema);

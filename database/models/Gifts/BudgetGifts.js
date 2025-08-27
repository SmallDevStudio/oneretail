import mongoose from "mongoose";

const BudgetGiftsSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    rh: { type: String },
    zone: { type: String },
    branchCode: { type: String },
    budget: { type: Number, required: true },
    user1: { type: String },
    user1_name: { type: String },
    user2: { type: String },
    user2_name: { type: String },
    approver: { type: String },
    approver_name: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.BudgetGifts ||
  mongoose.model("BudgetGifts", BudgetGiftsSchema);

import mongoose from "mongoose";

const UsedCouponSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    code: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.UsedCoupon ||
  mongoose.model("UsedCoupon", UsedCouponSchema);

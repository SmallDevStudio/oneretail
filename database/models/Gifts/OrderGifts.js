import mongoose from "mongoose";

const OrderGiftsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    branchId: { type: String, required: true },
    gifts: { type: Array, default: [] },
    status: {
      type: String,
      required: true,
      default: "order" /* draft || order || pending ||approve */,
    },
    info: { type: Array },
    update_by: [
      {
        userId: { type: String, required: true },
        update_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.OrderGifts ||
  mongoose.model("OrderGifts", OrderGiftsSchema);

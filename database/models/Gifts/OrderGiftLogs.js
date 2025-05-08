import mongoose from "mongoose";

const OrderGiftLogsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderGifts",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "update"],
      required: true,
    },
    changedFields: [String], // เช่น ['gifts', 'status']
    before: {
      type: mongoose.Schema.Types.Mixed, // เก็บข้อมูลก่อนเปลี่ยน
    },
    after: {
      type: mongoose.Schema.Types.Mixed, // เก็บข้อมูลหลังเปลี่ยน
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.OrderGiftLogs ||
  mongoose.model("OrderGiftLogs", OrderGiftLogsSchema);

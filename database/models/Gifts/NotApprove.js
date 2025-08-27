import mongoose from "mongoose";

const NotApproveSchema = new mongoose.Schema(
  {
    branchId: { type: String, required: true },
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    approverId: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.NotApprove ||
  mongoose.model("NotApprove", NotApproveSchema);

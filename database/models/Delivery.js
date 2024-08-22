import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    redeemTransId: { type: mongoose.Schema.Types.ObjectId, ref: 'RedeemTrans', required: true },
    userId: { type: String, ref: 'Users', required: true },
    creator: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
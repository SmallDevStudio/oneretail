const mongoose = require('mongoose');

const redeemTransSchema = new mongoose.Schema({
  redeemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Redeem', required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RedeemTrans || mongoose.model('RedeemTrans', redeemTransSchema);
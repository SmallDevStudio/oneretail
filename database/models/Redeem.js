const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({
  rewardCode: { type: String, required: true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  stock: { type: Number, required: true },
  coins: { type: Number },
  point: { type: Number },
  status: { type: Boolean, default: true },
  type: { type: String},
  creator: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Redeem || mongoose.model('Redeem', redeemSchema);
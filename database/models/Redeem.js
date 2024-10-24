const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({
  rewardCode: { type: String, required: true},
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  coins: { type: Number },
  point: { type: Number },
  status: { type: Boolean, default: true },
  type: { type: String},
  creator: { type: String, required: true },
  customOrder: { type: Number, default: 0 },
  group: { type: String },
  expireDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Redeem || mongoose.model('Redeem', redeemSchema);
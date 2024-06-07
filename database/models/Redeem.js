const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  stock: { type: Number, required: true },
  expire: { type: Date, required: false },
  coins: { type: Number, required: false },
  point: { type: Number, required: false },
  creator: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Redeem || mongoose.model('Redeem', redeemSchema);
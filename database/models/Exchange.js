import mongoose from 'mongoose';

const ExchangeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  points: { type: Number, required: true },
  coins: { type: Number, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Exchange || mongoose.model('Exchange', ExchangeSchema);
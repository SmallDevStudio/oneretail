import mongoose from 'mongoose';

const QRCodeTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The admin or creator's userId
  point: { type: Number, required: true },
  coins: { type: Number, required: false },
  ref: { type: String, required: true },
  remark: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  scannedBy: { type: [String], default: [] }, // Array of userIds who have scanned the QR code
  scannedAt: { type: [Date], default: [] },   // Array of dates when the QR code was scanned
});

export default mongoose.models.QRCodeTransaction || mongoose.model('QRCodeTransaction', QRCodeTransactionSchema);
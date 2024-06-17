// models/AdminAction.js
import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  groupName: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.AdminAction || mongoose.model('AdminAction', adminActionSchema);

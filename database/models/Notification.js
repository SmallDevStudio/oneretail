import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, ref: 'Users', required: true },
  description: { type: String, required: true },
  referId: { type: String },
  path: { type: String },
  subpath: { type: String },
  url: { type: String },
  type: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  isReading: { type: Boolean, default: false },
});

export default mongoose.models.Notifications || mongoose.model('Notifications', NotificationSchema);

import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true, unique: true },
  name: { type: String },
  userId: { type: String, ref: 'Users', required: true },
  type: { type: String, enum: ['image', 'video', 'file'], required: true },
  path: { type: String },
  isTemplate: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
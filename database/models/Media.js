import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: String, ref: 'Users', required: true },
  type: { type: String, enum: ['image', 'video'], required: true }
}, { timestamps: true });

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'Users' },
  description: { type: String, required: true,},
  contentId:{ type: String, },
  path: { type: String, },
  subpath: { type: String, },
  type: { type: String, required: true,},
  point: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Point || mongoose.model('Point', PointSchema);
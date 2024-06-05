import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  userId: String,
  time: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.View || mongoose.model('View', viewSchema);
import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, ref: 'Users', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  published: { type: Boolean, default: true },
  point: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  channel: { type: String, default: '' },
  position: { type: String, default: '' },
  group: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
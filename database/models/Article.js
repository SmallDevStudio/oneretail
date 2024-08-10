import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  thumbnail: { type: String },
  userId: { type: String, ref: 'Users', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  point: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  recommend: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: [{ type: String, ref: 'Users', default: [] }],
  tags: { type: [String], default: [] },
  position: { type: String},
  group: { type: String},
  subgroup: { type: String},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
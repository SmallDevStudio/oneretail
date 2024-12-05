import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  files: [{ public_id: { type: String }, url: { type: String } }],
  thumbnail: { public_id: { type: String }, url: { type: String } },
  tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
  userId: { type: String, ref: 'Users', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  point: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  recommend: { type: Boolean, default: false },
  views: [{userId: { type: String, ref: 'Users'}, createAt: { type: Date, default: Date.now }}],
  likes: [{ userId: {type: String, ref: 'Users'}, createAt: { type: Date, default: Date.now }}],
  tags: { type: [String], default: [] },
  position: { type: String},
  group: { type: String},
  subgroup: { type: String},
  rating: { type: Number },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true }, // This will store the text content
  link: { type: String }, // This will store the link (if any)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
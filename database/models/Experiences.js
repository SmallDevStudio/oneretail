import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  post: { type: String, required: true }, // This will store the text content
  link: { type: String }, // This will store the link (if any)
  image: { type: String },
  video: { type: String },
  userId: { type: String, ref: 'Users', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.models.Experiences || mongoose.model('Experiences', ExperienceSchema);
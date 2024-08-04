import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  post: { type: String, required: true }, // This will store the text content
  link: { type: String }, // This will store the link (if any)
  files: [{ type: String }],
  tagusers: [{ type: String, ref: 'Users' }],
  userId: { type: String, ref: 'Users', required: true },
  likes: [{ type: String, ref: 'Users' }],
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceComments' }],
});

export default mongoose.models.Experiences || mongoose.model('Experiences', ExperienceSchema);
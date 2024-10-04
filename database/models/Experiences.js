import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  post: { type: String }, // This will store the text content
  link: { type: String }, // This will store the link (if any)
  medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
  files: [{ public_id: { type: String }, url: { type: String } }],
  tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
  sticker: {
    public_id: { type: String },
    url: { type: String },
    type: { type: String }
  },
  userId: { type: String, ref: 'Users', required: true },
  likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceComments' }],
  pinned: { type: Boolean, default: false },
});

export default mongoose.models.Experiences || mongoose.model('Experiences', ExperienceSchema);
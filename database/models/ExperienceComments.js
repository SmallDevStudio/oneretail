import mongoose from 'mongoose';

const ExperienceCommentSchema = new mongoose.Schema({
    comment: { type: String },
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
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiences', required: true },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceReplyComments' }],
  }, { timestamps: true });
  
  export default mongoose.models.ExperienceComments || mongoose.model('ExperienceComments', ExperienceCommentSchema);
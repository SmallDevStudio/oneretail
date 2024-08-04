import mongoose from 'mongoose';

const ExperienceCommentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    files: [{ type: String }],
    tagusers: [{ type: String, ref: 'Users' }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceReplyComments' }],
    userId: { type: String, ref: 'Users', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiences', required: true },
    createdAt: { type: Date, default: Date.now },

  });
  
  export default mongoose.models.ExperienceComments || mongoose.model('ExperienceComments', ExperienceCommentSchema);
import mongoose from 'mongoose';

const ExperienceReplyCommentSchema = new mongoose.Schema({
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceComments', required: true },
    reply: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.models.ExperienceReplyComments || mongoose.model('ExperienceReplyComments', ExperienceReplyCommentSchema);
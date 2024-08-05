import mongoose from 'mongoose';

const ExperienceReplyCommentSchema = new mongoose.Schema({
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceComments', required: true },
    reply: { type: String, required: true },
    images: [{ public_id: { type: String }, url: { type: String } }],
    videos: [{ public_id: { type: String }, url: { type: String } }],
    files: [{ public_id: { type: String }, url: { type: String } }],
    tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
    likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
    userId: { type: String, ref: 'Users', required: true },
  }, { timestamps: true });
  
  export default mongoose.models.ExperienceReplyComments || mongoose.model('ExperienceReplyComments', ExperienceReplyCommentSchema);
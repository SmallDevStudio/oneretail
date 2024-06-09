import mongoose, { Schema } from "mongoose";
import Users from "@/pages/admin/users";

const ContentCommentSchema = new Schema({
    content: { type: String, required: true },
    user: { type: String, required: true, ref: 'Users' }, // Using unique userId string
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContentComment || mongoose.model('ContentComment', ContentCommentSchema);
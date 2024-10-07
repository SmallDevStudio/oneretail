import mongoose, { Schema } from "mongoose";
import Users from "@/pages/admin/users";

const ContentCommentSchema = new Schema({
    comment: { type: String }, // Renamed from 'content' to 'comment'
    userId: { type: String, required: true, ref: 'Users' }, // Renamed from 'user' to 'userId'
    medias: [{ public_id: { type: String }, url: { type: String }, type: { type: String } }],
    files: [{ public_id: { type: String }, url: { type: String } }],
    tagusers: [{ userId: { type: String, ref: 'Users' }, fullname: { type: String } }],
    sticker: {
        public_id: { type: String },
        url: { type: String },
        type: { type: String }
    },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    likes: [{ userId: { type: String, ref: 'Users' }, createAt: { type: Date, default: Date.now } }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReplyContentComment' }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContentComment || mongoose.model('ContentComment', ContentCommentSchema);

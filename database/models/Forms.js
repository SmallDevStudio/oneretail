import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { public_id: { type: String }, url: { type: String }, type: { type: String } },
    youtube: { 
        slug: { type: String },
        url: { type: String },
        thumbnailUrl: { type: String },
        title: { type: String },
        description: { type: String },
     },
    fields: [{
        title: { type: String, required: true },
        description: { type: String },
        image: { public_id: { type: String }, url: { type: String }, type: { type: String } },
        type: { type: String, required: true },
        options: [{ type: String }],
        vote: [{ type: String, ref: 'Vote' }],
    }],
    userId: { type: String, ref: 'Users', required: true },
    status: { type: Boolean, default: true },
    teamGrop: { type: String },
    group: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Forms || mongoose.model('Forms', formSchema);
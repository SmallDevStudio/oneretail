import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Groups = mongoose.models.groups || mongoose.model('groups', groupSchema);

export default Groups;
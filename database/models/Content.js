import mongoose, { Schema } from "mongoose";
import Category from "@/database/models/Category";
import Subcategory from "@/database/models/Subcategory";
import Group from "@/database/models/Group";
import SubGroup from "@/database/models/SubGroup";
import Users from "@/database/models/users";

const ContentSchema = new Schema({
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    slug: { type: String, unique: true, },
    youtubeUrl: { type: String, },
    thumbnailUrl: { type: String, },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategories: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', },
    groups: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', },
    subgroups: { type: mongoose.Schema.Types.ObjectId, ref: 'SubGroup', },
    author: { type: String, ref: 'Users' },
    publisher: { type: Boolean, default: true, },
    point: { type: Number, default: 0, },
    coins: { type: Number, default: 0, },
    views: { type: Number, default: 0,},
    likes: [{ type: String, ref: 'Users', default: [] }],
    tags: { type: [String], default: [] }, // Store tags as an array of strings
    pinned: { type: Boolean, default: false },
    recommend: { type: Boolean, default: false },
}, {
    timestamps: true
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
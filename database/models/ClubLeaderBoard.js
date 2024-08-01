import mongoose from "mongoose";

const clubLeaderBoardSchema = new mongoose.Schema({
    empId:{ type: String, required: true, ref: 'Users' },
    name: { type: String, required: true },
    branch: { type: String },
    zone: { type: String },
    type: { type: String },
    region: { type: String },
    achieve: { type: Number },
    rating: { type: String },
    rank: { type: Number },
    arrow: { type: String },
    rewerdtype: { type: String },
}, { timestamps: true });

export default mongoose.models.ClubLeaderBoard || mongoose.model('ClubLeaderBoard', clubLeaderBoardSchema)
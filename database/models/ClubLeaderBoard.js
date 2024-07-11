import mongoose from "mongoose";

const clubLeaderBoardSchema = new mongoose.Schema({
    empId:{ type: String, required: true, ref: 'Users' },
    type: { type: String, required: true },
    alsn: { tyoe: String },
    name: { type: String, required: true },
    branch: { type: String },
    zone: { type: String },
    position: { type: String },
    channel: { type: String },
    gh: { type: String },
    region: { type: String },
    rsn: { type: String },
    totalscore: { type: Number },
    achieve: { type: Number },
    kpi: { type: Number },
    rating: { type: String },
    rank: { type: Number },
    rewerdtype: { type: String },
}, { timestamps: true });

export default mongoose.models.ClubLeaderBoard || mongoose.model('ClubLeaderBoard', clubLeaderBoardSchema)
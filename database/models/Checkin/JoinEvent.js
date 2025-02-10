import mongoose from "mongoose";

const JoinEventSchema = new mongoose.Schema({
    eventCheckinId: { type: String, ref: 'EventCheckin', required: true },
    users: [{ type: String, ref: 'Users'}],
},{
    timestamps: true
});

export default mongoose.models.JoinEvent || mongoose.model('JoinEvent', JoinEventSchema);
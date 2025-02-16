import mongoose from "mongoose";

const JoinEventSchema = new mongoose.Schema({
    eventCheckinId: { type: String, ref: 'EventCheckin', required: true },
    user: { 
        userId: {type: String, ref: 'Users'},
        createdAt: { type: Date, default: Date.now }
    },
},{
    timestamps: true
});

export default mongoose.models.JoinEvent || mongoose.model('JoinEvent', JoinEventSchema);
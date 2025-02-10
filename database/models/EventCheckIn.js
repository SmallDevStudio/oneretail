import mongoose from "mongoose";

const EventCheckInSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    startDate: { type: Date },
    endDate: { type: Date },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    No: { type: String, default: '' },
    type: { type: String, default: 'training' },
    position: { type: String, default: '' },
    channel: { type: String, default: '' },
    place: { type: String, default: '' },
    mapLocation: { type: String, default: '' },
    link: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { type: Boolean, default: true },
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.EventCheckIn || mongoose.model('EventCheckIn', EventCheckInSchema);
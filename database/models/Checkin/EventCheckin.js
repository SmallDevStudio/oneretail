import mongoose from "mongoose";

const EventCheckinSchema = new mongoose.Schema({
    eventId: { type: String },
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
}, {
    timestamps: true
});

export default mongoose.models.EventCheckin || mongoose.model('EventCheckin', EventCheckinSchema);
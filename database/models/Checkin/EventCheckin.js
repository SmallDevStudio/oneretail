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
    position: { type: String, default: '' },
    channel: { type: String, default: '' },
    place: { type: String, default: '' },
    location: { type: String, default: '' },
    active: { type: Boolean, default: true },
    creator: { type: String, ref: 'Users', required: true },
    users: [{ 
        empId: { type: String, ref: 'Users' }, 
        fullname: { type: String } 
    }],
    remark: { type: String, default: '' },
}, {
    timestamps: true
});

export default mongoose.models.EventCheckin || mongoose.model('EventCheckin', EventCheckinSchema);
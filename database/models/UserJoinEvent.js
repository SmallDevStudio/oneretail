import mongoose from 'mongoose';

const UserJoinEventSchema = new mongoose.Schema({
    empId: [{ type: String, ref: 'Users'}],
    eventId: { type: String, ref: 'Events', required: true },
}, { timestamps: true });

export default mongoose.models.UserJoinEvent || mongoose.model('UserJoinEvent', UserJoinEventSchema);


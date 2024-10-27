import mongoose from "mongoose";

const CheckinsSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    userId: { type: String, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Checkins || mongoose.model('Checkins', CheckinsSchema);
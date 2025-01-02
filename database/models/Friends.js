import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({
        requester: { type: String, ref: 'Users', required: true },
        recipient: { type: String, ref: 'Users', required: true },
        status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    });
    
export default mongoose.models.Friends || mongoose.model('Friends', friendsSchema);
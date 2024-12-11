import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({
        userId: { type: String, required: true },
        friendId: { type: String, required: true },
        status: { type: String, required: true, default: 'null' },
    });
    
    export default mongoose.models.Friends || mongoose.model('Friends', friendsSchema);
import mongoose from "mongoose";

const LibraryViewSchema = new mongoose.Schema({
    public_id: { type: String, required: true},
    user: [{
        userId: { type: String, ref: 'Users', required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LibraryView || mongoose.model('LibraryView', LibraryViewSchema);
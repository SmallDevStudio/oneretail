import mongoose from "mongoose";

const galleryStoreSchema = new mongoose.Schema({
    galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true },
    title: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { 
        public_id: { type: String }, 
        url: { type: String }, 
        type: { type: String }  
    },
    driveUrl: { type: String, required: true },
    creator: { type: String, ref: 'Users', required: true },
}, {
    timestamps: true
});

export default mongoose.models.GalleryStore || mongoose.model('GalleryStore', galleryStoreSchema);
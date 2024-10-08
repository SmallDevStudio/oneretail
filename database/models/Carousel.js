import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
    media: { 
        public_id: { type: String }, 
        url: { type: String }, 
        type: { type: String, enum: ['image', 'video'] }, // Add type to distinguish between image and video
    },
    youtube: { 
        url: { type: String },
        thumbnailUrl: { type: String },
     },
    url: { type: String },
    userId: { type: String, ref: 'Users', required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Carousel || mongoose.model('Carousel', CarouselSchema);
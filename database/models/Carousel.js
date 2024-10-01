import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
    image: { public_id: { type: String }, url: { type: String }, type: { type: String } },
    url: { type: String },
    userId: { type: String, ref: 'Users', required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Carousel || mongoose.model('Carousel', CarouselSchema);
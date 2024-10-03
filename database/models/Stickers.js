import mongoose from 'mongoose';

const Stickers = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { 
        public_id: { type: String }, 
        url: { type: String }, 
        type: { type: String } 
    },
    sticker: [{ 
        public_id: { type: String }, 
        url: { type: String }, 
        type: { type: String } 
    }],
    active: { type: Boolean, default: true },
},{ timestamps: true });

export default mongoose.models.Stickers || mongoose.model('Stickers', Stickers);
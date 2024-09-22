import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: [{ 
        public_id: { type: String }, 
        url: { type: String }, 
        type: { type: String } 
    }],
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Badges || mongoose.model('Badges', BadgeSchema);
import mongoose from 'mongoose';

const socialClubSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'Users' },
    empId: { type: String, required: true },
    empName: { type: String, required: true },
    options: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SocialClub || mongoose.model('SocialClub', socialClubSchema);
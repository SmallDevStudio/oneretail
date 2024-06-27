// models/Campaign.js
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  banner: { type: String },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  userId: { type: String, ref: 'User', required: true },
},{
  timestamps: true
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

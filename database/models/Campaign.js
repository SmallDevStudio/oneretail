// models/Campaign.js
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { public_id: { type: String }, url: { type: String }, type: { type: String } },
  banner: { public_id: { type: String }, url: { type: String }, type: { type: String } },
  smallbanner: { public_id: { type: String }, url: { type: String }, type: { type: String } },
  url: { type: String },
  isActive: { type: Boolean, default: true },
  userId: { type: String, ref: 'User', required: true },
},{
  timestamps: true
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

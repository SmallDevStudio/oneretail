import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  No: { type: String, default: '' },
  type: { type: String, default: 'training' },
  position: { type: String, default: '' },
  channel: { type: String, default: '' },
  place: { type: String, default: '' },
  mapLocation: { type: String, default: '' },
  link: { type: String, default: '' },
  note: { type: String, default: '' },
  status: { type: Boolean, default: true },
  creator: { type: String, ref: 'Users' },
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  No: { type: String },
  type: { type: String },
  position: { type: String },
  channel: { type: String },
  place: { type: String },
  mapLocation: { type: String },
  link: { type: String, default: '' },
  note: { type: String },
  status: { type: Boolean, default: true },
  creator: { type: String, ref: 'Users' },
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
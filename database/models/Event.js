import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  group: String,
  position: String,
  place: String,
  mapLocation: String,
  note: String,
  status: String,
  creator: String,
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
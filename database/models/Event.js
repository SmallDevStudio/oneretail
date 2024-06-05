import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  startdate: Date,
  time: String,
  enddate: Date,
  name: String,
  description: String,
  group: String,
  position: String,
  location: String,
  maplocation: String,
  note: String,
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
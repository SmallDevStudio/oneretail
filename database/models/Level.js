import mongoose from 'mongoose';

const LevelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    unique: true,
  },
  requiredPoints: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Level || mongoose.model('Level', LevelSchema);
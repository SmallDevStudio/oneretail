import mongoose from 'mongoose';

const SurveySettingsSchema = new mongoose.Schema({
    isSurveyEnabled: {type: Boolean, required: true, default: true}
}, { timestamps: true });

export default mongoose.models.SurveySettings || mongoose.model('SurveySettings', SurveySettingsSchema);
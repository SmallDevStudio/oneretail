const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    type: { type: String, enum: ['text', 'image', 'user', 'content'], required: true },
    value: { type: String, required: true }
});

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    options: [OptionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_date: { type: Date, required: true },
    end_time: { type: String, required: true },
    title_location: { type: String },
    location: { type: Array, default: [] },
    caterogy: { type: String, default: undefined },
    subCaterogy: { type: String, default: undefined },
    comments: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    options: { type: Array, default: [] },
    active: { type: Boolean, default: true },
    employee_id: { type: String, required: true },
}, {
    timestamps: true
});

const Event = mongoose.models.event || mongoose.model('event', eventSchema);

export default Event;
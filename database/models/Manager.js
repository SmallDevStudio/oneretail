import mongoose, { Schema } from "mongoose";

const managerSchema = new Schema({
    userId: { type: String, required: true },
    loginDate: { type: Date, required: true },
}, {
    timestamps: true
});

const Manager = mongoose.models.Manager || mongoose.model('Manager', managerSchema);

export default Manager;

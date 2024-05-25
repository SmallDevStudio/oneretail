import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    role: { type: String },
    active: { type: Boolean, default: true },
    employee_id: { type: String, required: true },
    line_id: { type: String },
}, {
    timestamps: true
});

const users = mongoose.models.users || mongoose.model('users', userSchema);

export default users;
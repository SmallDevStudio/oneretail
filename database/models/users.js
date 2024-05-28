import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    role: { type: String },
    active: { type: Boolean, default: true },
    empId: { type: String, required: true },
    userId: { type: String },
}, {
    timestamps: true
});

const Users = mongoose.models.users || mongoose.model('users', userSchema);

export default Users;
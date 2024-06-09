import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    role: { type: String },
    active: { type: Boolean, default: true },
    empId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);

export default Users;
import mongoose, { Schema } from "mongoose";

const empSchema = new Schema({
    empId: { type: String, required: true },
    teamGrop: { type: String},
    sex: { type: String},
    branch: { type: String},
    department: { type: String},
    group: { type: String},
    chief_th: { type: String},
    chief_eng: { type: String},
    position: { type: String},
    name: { type: String},
});

const Emp = mongoose.models.emp || mongoose.model('emp', empSchema);

export default Emp;
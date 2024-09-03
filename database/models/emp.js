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
    branch_en: { type: String},
    department_en: { type: String},
    group_en: { type: String},
    position2: { type: String},
    position3: { type: String},
});

const Emp = mongoose.models.emp || mongoose.model('emp', empSchema);

export default Emp;
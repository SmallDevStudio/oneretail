import mongoose, { Schema } from "mongoose";

const empSchema = new Schema({
  empId: { type: String, required: true },
  teamGrop: { type: String },
  sex: { type: String },
  branch: { type: String },
  departmentshort: { type: String },
  department: { type: String },
  group: { type: String },
  chief_th: { type: String },
  chief_eng: { type: String },
  position: { type: String },
  positionfull: { type: String },
  name: { type: String },
  group: { type: String },
  group2: { type: String },
  managerId: { type: String },
});

const Emp = mongoose.models.emp || mongoose.model("emp", empSchema);

export default Emp;

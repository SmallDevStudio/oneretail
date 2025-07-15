import mongoose from "mongoose";

const NewGroupsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NewGroups ||
  mongoose.model("NewGroups", NewGroupsSchema);

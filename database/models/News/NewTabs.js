import mongoose from "mongoose";

const NewTabsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.NewTabs ||
  mongoose.model("NewTabs", NewTabsSchema);

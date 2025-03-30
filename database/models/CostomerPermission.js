import mongoose from "mongoose";

const CostomerPermissionSchema = new mongoose.Schema(
  {
    users: [{ type: String, ref: "Users" }],
  },
  { timestamps: true }
);

export default mongoose.models.CostomerPermission ||
  mongoose.model("CostomerPermission", CostomerPermissionSchema);

import mongoose from "mongoose";

const CouponsSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    descriptions: { type: String },
    point: { type: Number },
    coins: { type: Number },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    stock: { type: Number, default: 0 },
    note: { type: String },
    image: { public_id: { type: String }, url: { type: String } },
    repeatable: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    created_by: { type: String, ref: "Users", required: true },
    updated_by: [{ type: String, ref: "Users" }],
  },
  { timestamps: true }
);

export default mongoose.models.Coupons ||
  mongoose.model("Coupons", CouponsSchema);

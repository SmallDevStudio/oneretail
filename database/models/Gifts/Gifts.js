import mongoose from "mongoose";

const GiftsSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Gifts || mongoose.model("Gifts", GiftsSchema);

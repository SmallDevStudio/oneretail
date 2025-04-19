import mongoose from "mongoose";

const EbooksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: {
      type: Object,
      required: false,
      default: undefined,
    },
    ebook: {
      type: Object,
      required: true,
    },
    url: { type: String, required: true },
    category: { type: String },
    group: { type: String },
    type: { type: String },
    createdAt: { type: Date, default: Date.now },
    creator: { type: String, ref: "Users", required: true },
    active: { type: Boolean, default: true },
  },
  { strict: false }
);

export default mongoose.models.Ebooks || mongoose.model("Ebooks", EbooksSchema);

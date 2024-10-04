import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
    public_id: { type: String, required: true, unique: true }, // แก้ไขจาก pubilc_id เป็น public_id
    file_name: { type: String },
    description: { type: String },
    file_size: { type: Number },
    mime_type: { type: String },
    image_width: { type: Number },
    image_height: { type: Number },
    url: { type: String, required: true }, // เพิ่มฟิลด์ URL เพื่อเก็บ public URL ของรูปภาพ
    type: { type: String, enum: ['image', 'video', 'file'], required: true },
    folder: { type: String },
    subfolder: { type: String },
    isTemplate: { type: Boolean, default: false },
    userId: { type: String, ref: 'Users', required: true },
    group: { type: String },
}, { timestamps: true });

export default mongoose.models.Library || mongoose.model('Library', LibrarySchema);
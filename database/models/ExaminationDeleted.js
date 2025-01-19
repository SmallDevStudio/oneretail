import mongoose from "mongoose";

const ExaminationDeletedSchema = new mongoose.Schema({
   examId: { type: mongoose.Schema.Types.ObjectId, ref: "Examinations2", required: true },
   userId: { type: String, ref: "Users", required: true },
},{ timestamps: true });

export default mongoose.models.ExaminationDeleted || mongoose.model('ExaminationDeleted', ExaminationDeletedSchema);
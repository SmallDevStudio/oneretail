import mongoose from "mongoose";

const ExaminationAnswerSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Examinations2", required: true },
    userId: { type: String, ref: "Users", required: true },
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: "UserAnswer"}],
    isComplete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ExaminationAnswer ||
  mongoose.model("ExaminationAnswer", ExaminationAnswerSchema);

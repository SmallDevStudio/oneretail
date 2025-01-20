import mongoose from "mongoose";

const UserAnswerSchema = new mongoose.Schema(
  {
    examAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: "ExaminationAnswer", required: true },
    userId: { type: String, ref: "Users", required: true },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamQuestions" },
        answer: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.models.UserAnswer ||
  mongoose.model("UserAnswer", UserAnswerSchema);

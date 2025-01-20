import connectMongoDB from "@/lib/services/database/mongodb";
import ExaminationAnswer from "@/database/models/ExaminationAnswer";
import UserAnswer from "@/database/models/UserAnswer";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case "GET":
            try {
                const { userId } = req.query;
                if (!userId || !id) {
                    return res.status(400).json({ success: false, message: "Missing required parameters" });
                }

                const examinationAnswers = await ExaminationAnswer.findOne({ examId: id, userId });
                if (!examinationAnswers) {
                    return res.status(404).json({ success: false, message: "Examination answers not found" });
                }

                res.status(200).json({ success: true, data: examinationAnswers });
            } catch (error) {
                console.error("Error fetching examination answers:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
            break;

        case "POST":
            try {
                const { userId, answers, isComplete } = req.body;

                // ตรวจสอบว่า body ครบถ้วน
                if (!userId || !id || !Array.isArray(answers) || typeof isComplete !== "boolean") {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Invalid or missing body parameters (userId, answers, isComplete)" 
                    });
                }

                // ค้นหา ExaminationAnswer
                let examination = await ExaminationAnswer.findOne({ examId: id, userId: userId });

                if (examination && examination?.isComplete) {
                    return res.status(400).json({ success: false, message: "Examination has already been completed" });
                }

                if (!examination) {
                    // สร้างใหม่ถ้ายังไม่มี
                    examination = await ExaminationAnswer.create({
                        examId: id,
                        userId,
                        answers: [],
                        isComplete: false,
                    });
                }

                // สร้าง UserAnswer
                const userAnswer = await UserAnswer.create({
                    examAnswerId: examination._id,
                    userId,
                    answers,
                });

                // อัปเดต ExaminationAnswer
                examination.answers.push(userAnswer._id);
                examination.isComplete = isComplete;
                await examination.save();

                res.status(201).json({ success: true, data: examination });
            } catch (error) {
                console.error("Error saving answers:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

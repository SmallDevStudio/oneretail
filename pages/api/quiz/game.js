import connectMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method, query } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ตรวจสอบว่า team group อยู่ใน query หรือไม่
                const teamGroup = req.query.group;

                // ใช้ regex เพื่อดึงข้อมูลที่ขึ้นต้นด้วย teamGroup
                const quizzes = await Quiz.aggregate([
                    { 
                        $match: { 
                            subgroup: req.query.subgroup,
                            group: { $regex: `^${teamGroup}(_|$)`, $options: "i" }, 
                            active: true 
                        }
                    },
                    { $sample: { size: 5 }} // สุ่มคำถามตามจำนวนที่ต้องการ
                ]);

                res.status(200).json({ success: true, data: quizzes });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
};

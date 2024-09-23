// api
import connetMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method } = req;
    connetMongoDB();
    switch (method) {
        case "GET":
            try {
                // รับค่า page และ limit จาก query parameters
                const { page = 1, limit = 10 } = req.query;
                const pageNumber = parseInt(page);
                const limitNumber = parseInt(limit);

                // คำนวณการ skip
                const skip = (pageNumber - 1) * limitNumber;

                // ใช้ skip และ limit เพื่อจัดการการแบ่งหน้า
                const quiz = await Quiz.find().skip(skip).limit(limitNumber);
                const total = await Quiz.countDocuments(); // จำนวนทั้งหมดของคําถาม

                res.status(200).json({
                    data: quiz,
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const quiz = await Quiz.create(req.body);
                res.status(201).json(quiz);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}

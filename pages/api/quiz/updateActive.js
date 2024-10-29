import connectMongoDB from "@/lib/services/database/mongodb";
import Quiz from "@/database/models/Quiz";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "PUT":
            try {
                // อัปเดตเอกสารทั้งหมดใน Quiz collection ให้มี active: true
                const result = await Quiz.updateMany({}, { $set: { active: true } });

                res.status(200).json({
                    success: true,
                    message: "All quiz documents updated to active: true",
                    modifiedCount: result.modifiedCount,
                });
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

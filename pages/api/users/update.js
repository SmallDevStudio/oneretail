import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { userId } = req.query;
                const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // ใช้ findByIdAndUpdate แทน findOneAndUpdate
                if (!user) {
                    return res.status(400).json({ success: false, error: "User not found" });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
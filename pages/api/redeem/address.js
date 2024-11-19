import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { empId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const user = await Users.findOne({ empId: empId });
                if (!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(500).json({ success: false, message: "Server error" });
            }
            break;
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

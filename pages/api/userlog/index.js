import connetMongoDB from "@/lib/services/database/mongodb";
import UserLog from "@/database/models/UserLog";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const userLogs = await UserLog.find({});
                res.status(200).json(userLogs);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            console.log(req.body);
            try {
                const userLog = await UserLog.create(req.body);
                res.status(201).json(userLog);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    };
}
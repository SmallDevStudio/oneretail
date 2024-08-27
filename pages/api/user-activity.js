import connetMongoDB from "@/lib/services/database/mongodb";
import UserActivity from "@/database/models/UserActivity";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const userActivities = await UserActivity.find({});
                res.status(200).json(userActivities);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "POST":
            try {
                const userActivity = await UserActivity.create(req.body);
                res.status(201).json(userActivity);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
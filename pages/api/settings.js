import connetMongoDB from "@/lib/services/database/mongodb";
import Setting from "@/database/models/Setting";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === "GET") {
        try {
            const settings = await Setting.find({});
            res.status(200).json({ success: false, data: settings });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else if (req.method === "POST") {
        try {
            const setting = await Setting.create(req.body);
            res.status(201).json(setting);
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
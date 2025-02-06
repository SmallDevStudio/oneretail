import connetMongoDB from "@/lib/services/database/mongodb";
import Login from "@/database/models/Reward";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method } = req;
    const { userId } = req.query;

    switch (method) {
        case "GET":
            try {
                const logins = await Login.find({userId: userId});
                res.status(200).json(logins);
            } catch (error) {
                res.status(400).json({ success: false });
            }
        case "POST":
            try {
                const login = await Login.create({userId: userId});
                res.status(201).json(login);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}

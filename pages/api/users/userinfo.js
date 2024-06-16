import connetMongoDB from "@/lib/services/database/mongodb";
import UserInfo from "@/database/models/UserInfo";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const user = await UserInfo.findOne({ userId });
                res.status(200).json({ user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { userId, ...data } = req.body;
                const user = await UserInfo.findOneAndUpdate({ userId }, data, {
                    new: true,
                });
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
};

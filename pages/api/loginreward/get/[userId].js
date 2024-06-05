import connetMongoDB from "@/lib/services/database/mongodb";
import LoginReward from "@/database/models/LoginReward";


export default async function handler(req, res) {
    await connetMongoDB();

    const { userId } = req.query;

    if (req.method === "GET") {
        const loginReward = await LoginReward.findOne({ userId });
        res.status(200).json(loginReward);
    }
};
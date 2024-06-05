import connetMongoDB from "@/lib/services/database/mongodb";
import LoginReward from "@/database/models/LoginReward";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === "GET") {
        const loginRewards = await LoginReward.find();
        res.status(200).json(loginRewards);
    } else if (req.method === "POST") {
        const loginReward = await LoginReward.create(req.body);
        res.status(201).json(loginReward);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
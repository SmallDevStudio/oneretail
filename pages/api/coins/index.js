import connetMongoDB from "@/lib/services/database/mongodb";
import Coins from "@/database/models/Coins";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const coins = await Coins.find();
        res.status(200).json(coins);
    } else if (req.method === "POST") {
        const { ...data } = req.body;
        await connetMongoDB();
        const coin = await Coins.create(data);
        res.status(201).json(coin);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
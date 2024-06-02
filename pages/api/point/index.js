import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const points = await Point.find();
        res.status(200).json(points);

    } else if (req.method === "POST") {
        const { ...data } = req.body;
        await connetMongoDB();
        const point = await Point.create(data);
        res.status(201).json(point);
        
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
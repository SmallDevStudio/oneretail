import connetMongoDB from "@/lib/services/database/mongodb";
import Groups from "@/database/models/groups";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const groups = await Groups.find();
        res.status(200).json({ groups });
    } else if (req.method === "POST") {
        const { name, description } = req.body;
        await connetMongoDB();
        await Groups.create({ name, description });
        res.status(201).json({ message: "Groups created successfully" });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
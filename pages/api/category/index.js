import connetMongoDB from "@/services/database/mongoose/mongodb";
import Caterory from "@/database/models/category";

export default async function handler(req, res) {
    if (req.method === "GET") {
        
        
    } else if (req.method === "POST") {
        const { title, description, icon, image, note } = req.body;
        await connetMongoDB();
        const category = await Caterory.create({ title, description, icon, image, note });
        if (!category) {
            res.status(500).json({ message: "category not created" });
        } else {
            res.status(201).json({ category });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

import connetMongoDB from "@/services/database/mongoose/mongodb";
import SubCategory from "@/database/models/category";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const subcategory = await SubCategory.find({});
        if (!subcategory) {
            res.status(404).json({ message: "subcategory not found" });
        } else {
            res.status(200).json({ subcategory });
        }
    } else if (req.method === "POST") {
        const subcategoryData = req.body;
        await connetMongoDB();
        const subcategory = await SubCategory.create(subcategoryData);
        if (!subcategory) {
            res.status(500).json({ message: "subcategory not created" });
        } else {
            res.status(201).json({ subcategory });
        }
    }
    res.status(405).json({ error: "Method not allowed" });
}
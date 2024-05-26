import connetMongoDB from "@/services/database/mongoose/mongodb";
import SubCategory from "@/database/models/Category";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const subcategory = await SubCategory.find({});
        res.status(200).json({ subcategory });
    } else if (req.method === "POST") {
        const subcategoryData = req.body;
        await connetMongoDB();
        const subcategory = await SubCategory.create(subcategoryData);
        res.status(201).json({ message: "subcategory created successfully", subcategory });
    }
    res.status(405).json({ error: "Method not allowed" });
}
import mongoose, { ObjectId } from "mongoose";
import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        const { subcategory } = req.query;

        if (!mongoose.Types.ObjectId.isValid(subcategory)) {
            return res.status(400).json({ error: "Invalid subcategory ID" });
        }

        const objectIdSubcategory = new mongoose.Types.ObjectId(subcategory);

        try {
            const contents = await Content.find({ subcategories: objectIdSubcategory }).lean().exec();

            if (contents.length > 0) {
                res.status(200).json(contents[0]); // Return only one record
            } else {
                res.status(404).json({ error: "No content found for the given subcategory" });
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
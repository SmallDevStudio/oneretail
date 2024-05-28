import connetMongoDB from "@/services/database/mongoose/mongodb";
import Contents from "@/database/models/content";
import { constants } from "crypto";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        await connetMongoDB();
        const contents = await Contents.findOne({ _id: id });
        if (!contents) {
            res.status(404).json({ message: "Contents not found" });
        } else {
            res.status(200).json({ contents });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;
        const { title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id } = req.body;
        await connetMongoDB();
        const contents = await Contents.findOneAndUpdate({ _id: id }, 
            { title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id }, 
            { new: true });
        if (!contents) {
            res.status(404).json({ message: "Contents not found" });
        } else {
            res.status(200).json({ constants });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        await connetMongoDB();
        const contents= await Contents.findOneAndDelete({ _id: id });
        if (!contents) {
            res.status(404).json({ message: "Contents not found" });
        } else {
            res.status(200).json({ message: "Contents deleted successfully" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
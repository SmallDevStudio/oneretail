import connetMongoDB from "@/services/database/mongoose/mongodb";
import Contents from "@/database/models/content";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const Contents = await Contents.find({});
        if (!Contents) {
            res.status(404).json({ message: "Contents not found" });
        } else {
            if (Contents.length === 0) {
                res.status(404).json({ message: "Contents on Data.." });
            } else {
                res.status(200).json({ learning });
            }
        }
    } else if (req.method === "POST") {
        const { title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id  } = req.body;
        await connetMongoDB();
        const contents = await Contents.create({ title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id });
        if (!contents) {
            res.status(500).json({ message: "Contents not created" });
        } else {
            res.status(201).json({ contents });
        }
    }

}
import connetMongoDB from "@/services/database/mongoose/mongodb";
import Learning from "@/database/models/learning";


export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const learning = await Learning.find({});
        if (!learning) {
            res.status(404).json({ message: "learning not found" });
        } else {
            if (learning.length === 0) {
                res.status(404).json({ message: "learning on Data.." });
            } else {
                res.status(200).json({ learning });
            }
        }
    } else if (req.method === "POST") {
        const { title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id  } = req.body;
        await connetMongoDB();
        const learning = await Learning.create({ title, description, slug, youtubeUrl, thumbnailUrl, category, subCategory, point, coin, options, user_created_id });
        if (!learning) {
            res.status(500).json({ message: "learning not created" });
        } else {
            res.status(201).json({ learning });
        }
    }

}
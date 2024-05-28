import connetMongoDB from "@/lib/services/database/mongodb";
import Contents from "@/database/models/contents";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const contents = await Contents.find();
        res.status(200).json({ contents });
    } else if (req.method === "POST") {
        const { title, description, youtubeUrl, videoId, slug, thumbnailUrl, duration, durationMinutes, caterogy, subcaterogy } = req.body;
        await connetMongoDB();
        await Contents.create({ title, description, youtubeUrl, videoId, slug, thumbnailUrl, duration, durationMinutes, caterogy, subcaterogy });
        res.status(201).json({ message: "Content created successfully" });
    }
}
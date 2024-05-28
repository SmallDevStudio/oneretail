import connetMongoDB from "@/lib/services/database/mongodb";
import Contents from "@/database/models/contents";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        await connetMongoDB();
        const contents = await Contents.findOne({ _id: id });
        res.status(200).json({ contents });
    } else if (req.method === "PUT") {
        const { id } = req.query;
        const { title, description, youtubeUrl, videoId, slug, thumbnailUrl, duration, durationMinutes, caterogy, subcaterogy } = req.body;
        await connetMongoDB();
        await Contents.updateOne({ _id: id }, { $set: { title, description, youtubeUrl, videoId, slug, thumbnailUrl, duration, durationMinutes, caterogy, subcaterogy, options, author } });
        res.status(201).json({ message: "Content created successfully" });
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        await connetMongoDB();
        await Contents.deleteOne({ _id: id });
        res.status(200).json({ message: "Content deleted successfully" });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
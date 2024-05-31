import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        try {
            const contents = await Content.find({});
            res.status(200).json(contents);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }

    if (req.method === "POST") {
        try {
            const content = await Content.create(req.body);
            res.status(201).json(content);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}
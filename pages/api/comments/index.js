import connetMongoDB from "@/lib/services/database/mongodb";
import Comment from "postcss/lib/comment";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const comments = await Comment.find({});
        res.status(200).json(comments);
    } else if (req.method === "POST") {
        const { ...data } = req.body;
        await connetMongoDB();
        const comment = await Comment.create(data);
        res.status(201).json(comment);
    } else if (req.method === "PUT") {
        const { id, ...data } = req.body;
        await connetMongoDB();
        const comment = await Comment.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(comment);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
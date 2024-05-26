import connetMongoDB from "@/services/database/mongoose/mongodb";
import Learning from "@/database/models/learning";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        await connetMongoDB();
        const learning = await Learning.findOne({ _id: id });
        if (!learning) {
            res.status(404).json({ message: "learning not found" });
        } else {
            res.status(200).json({ learning });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;
        await connetMongoDB();
        const learning = await Learning.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!learning) {
            res.status(404).json({ message: "learning not found" });
        } else {
            res.status(200).json({ learning });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        await connetMongoDB();
        const learning = await Learning.findOneAndDelete({ _id: id });
        if (!learning) {
            res.status(404).json({ message: "learning not found" });
        } else {
            res.status(200).json({ message: "learning deleted successfully" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
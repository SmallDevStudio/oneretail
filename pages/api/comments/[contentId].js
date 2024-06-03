import connetMongoDB from "@/lib/services/database/mongodb";
import Comments from "@/database/models/Comments";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { contentId } = req.query;
        await connetMongoDB();
        const comments = await Comments.find({ contentId: contentId });
        res.status(200).json(comments);
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        await connetMongoDB();
        const deletedComments = await Comments.findByIdAndDelete(id);
        res.status(200).json(deletedComments);
    }
}
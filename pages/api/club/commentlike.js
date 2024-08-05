import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceComments from "@/database/models/ExperienceComments";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "PUT": 
            try {
                const { commentId, userId } = req.body;
                const comment = await ExperienceComments.findOne({ _id: commentId });
                if (!comment) {
                    return res.status(404).json({ success: false, error: "Comment not found" });
                }

                const likesSet = new Set(comment.likes.map(String));
                if (likesSet.has(userId)) {
                    likesSet.delete(userId);
                } else {
                    likesSet.add(userId);
                }

                comment.likes = Array.from(likesSet);
                await comment.save();

                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}
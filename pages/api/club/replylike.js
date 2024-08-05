import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { replyId, userId } = req.body;
                const reply = await ExperienceReplyComments.findOne({ _id: replyId });
                if (!reply) {
                    return res.status(404).json({ success: false, error: "Reply not found" });
                }

                const likesSet = new Set(reply.likes.map(String));
                if (likesSet.has(userId)) {
                    likesSet.delete(userId);
                } else {
                    likesSet.add(userId);
                }

                reply.likes = Array.from(likesSet);
                await reply.save();

                res.status(200).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
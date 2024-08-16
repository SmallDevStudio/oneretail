import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { contentId, userId } = req.body;

                const content = await Content.findById(contentId);

                if (!content) {
                    return res.status(404).json({ success: false, error: "Content not found" });
                }

                // Check if userId already exists in likes
                const likeIndex = content.likes.findIndex(like => like === userId);

                if (likeIndex !== -1) {
                    // User already liked the content, so we remove the like
                    content.likes.splice(likeIndex, 1);
                } else {
                    // User hasn't liked the content yet, so we add the like
                    content.likes.push(userId);
                }

                await content.save();

                return res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}

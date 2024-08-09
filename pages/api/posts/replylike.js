import connectMongoDB from "@/lib/services/database/mongodb";
import Reply from "@/database/models/Reply";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { replyId, userId } = req.body;
                const reply = await Reply.findById(replyId);

                if (!reply) {
                    return res.status(404).json({ success: false, error: "Reply not found" });
                }

                const alreadyLiked = reply.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });

                if (alreadyLiked) {
                    reply.likes = reply.likes.filter(like => like.userId !== userId);
                } else {
                    reply.likes.push({ userId });

                    await Notifications.create({
                        userId: reply.userId,
                        description: `${user.fullname} ได้กด like คอมเมนต์ใน Share Your Story, Reply Comment`,
                        referId: reply._id,
                        path: 'Share Your Story',
                        subpath: 'Reply',
                        url: `${process.env.NEXTAUTH_URL}stores?tab=share-your-story#${reply.commentId}`,
                        type: "Like",
                    });
                }

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
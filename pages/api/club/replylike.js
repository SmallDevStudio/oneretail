// api/club/replylike.js
import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            const { replyId, userId } = req.body;

            try {
                const reply = await ExperienceReplyComments.findById(replyId);

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
                        description: `${user.fullname} ได้กด like การตอบกลับใน Experience`,
                        contentId: reply._id,
                        link: `${process.env.NEXTAUTH_URL}/club?tab=experience#${reply.commentId}`,
                        type: 'Like'
                    });
                }

                await reply.save();

                res.status(200).json({ success: true, data: reply });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}

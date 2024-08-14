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
                const alreadyLiked = content.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });
                if (alreadyLiked) {
                    content.likes = content.likes.filter(like => like.userId !== userId);
                } else {
                    content.likes.push({ userId });

                    if (userId !== content.userId) {
                        await Notifications.create({
                            userId: content.userId,
                            senderId: userId,
                            description: `ได้กด like โพสใน Content`,
                            referId: content._id,
                            path: 'Content',
                            subpath: 'Post',
                            url: `${process.env.NEXTAUTH_URL}learning/${content._id}`,
                            type: 'Like'
                        });
                    }
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
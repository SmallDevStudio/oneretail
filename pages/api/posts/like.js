import connectMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            const { postId, userId } = req.body;

            try {
                const post = await Post.findById(postId);

                if (!post) {
                    return res.status(404).json({ success: false, error: "Post not found" });
                }

                const alreadyLiked = post.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });

                if (alreadyLiked) {
                    post.likes = post.likes.filter(like => like.userId !== userId);
                } else {
                    post.likes.push({ userId });

                    await Notifications.create({
                        userId: post.userId,
                        description: `${user.fullname} ได้กด like โพสใน Post`,
                        referId: post._id,
                        path: 'Share Your Story',
                        subpath: 'Post',
                        url: `${process.env.NEXTAUTH_URL}/stores?tab=share-your-story#${post._id}`,
                        type: 'Like'
                    });
                }

                await post.save();

                res.status(200).json({ success: true, data: post });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            return res.status(400).json({ success: false });
    }
}
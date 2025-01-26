import connectMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                // ดึงโพสต์ทั้งหมด
                const posts = await Post.find({}).sort({ createdAt: -1 });
                const userIds = posts.map(post => post.userId);
                const users = await Users.find({ userId: { $in: userIds } });
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // เตรียมโพสต์ populated
                const populatedPost = await Promise.all(
                    posts.map(async (post) => {
                        const comments = await Comment.find({ postId: post._id });
                        const commentUserIds = comments.map(comment => comment.userId);
                        const commentUsers = await Users.find({ userId: { $in: commentUserIds } });
                        const commentUserMap = commentUsers.reduce((acc, user) => {
                            acc[user.userId] = user;
                            return acc;
                        }, {});

                        const populatedComments = await Promise.all(comments.map(async (comment) => {
                            const replies = await Reply.find({ commentId: comment._id });
                            const replyUserIds = replies.map(reply => reply.userId);
                            const replyUsers = await Users.find({ userId: { $in: replyUserIds } });
                            const replyUserMap = replyUsers.reduce((acc, user) => {
                                acc[user.userId] = user;
                                return acc;
                            }, {});

                            const populatedReplies = replies.map(reply => ({
                                ...reply._doc,
                                user: replyUserMap[reply.userId],
                            }));

                            return {
                                ...comment._doc,
                                user: commentUserMap[comment.userId],
                                reply: populatedReplies,
                            };
                        }));

                        return {
                            ...post._doc,
                            user: userMap[post.userId],
                            comments: populatedComments,
                        };
                    })
                );

                // ดึงโพสต์ที่มีเฉพาะภาพ
                const imagePosts = posts.filter(post =>
                    post.medias.some(media => media.type === 'image')
                );

                // ดึงโพสต์ที่มีเฉพาะวิดีโอ
                const videoPosts = posts.filter(post =>
                    post.medias.some(media => media.type === 'video')
                );

                // เตรียม image และ video เป็น populated
                const populatedImage = await Promise.all(
                    imagePosts.map(async (post) => ({
                        ...post._doc,
                        user: userMap[post.userId],
                    }))
                );

                const populatedVideo = await Promise.all(
                    videoPosts.map(async (post) => ({
                        ...post._doc,
                        user: userMap[post.userId],
                    }))
                );

                // ส่ง response
                res.status(200).json({
                    success: true,
                    data: populatedPost,
                    images: populatedImage,
                    video: populatedVideo,
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}

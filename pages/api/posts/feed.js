import connectMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";
import Friends from "@/database/models/Friends";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query; // User ที่กำลังดู feed

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ดึงโพสต์ทั้งหมด
                const posts = await Post.find({}).sort({ createdAt: -1 });

                // ดึงข้อมูลเพื่อนของผู้ใช้
                const friends = await Friends.find({
                    $or: [{ userId }, { friendId: userId }],
                    status: "friend",
                });

                // ถ้าไม่มีข้อมูลใน friendsSchema ให้ตั้ง friendIds เป็น array ว่าง
                const friendIds = friends.length
                    ? friends.map((f) => (f.userId === userId ? f.friendId : f.userId))
                    : [];

                // กรองโพสต์ตาม page และ status
                const postPagePosts = posts.filter((post) => post.page === "post");
                const otherPagePosts = posts.filter((post) => post.page !== "post");

                const filteredPosts = postPagePosts.filter((post) => {
                    if (post.status === "published") return true; // โชว์ทุกคน
                    if (friendIds.length > 0 && post.status === "friend" && friendIds.includes(post.userId)) return true; // เฉพาะเพื่อน
                    if (post.status === "private" && post.userId === userId) return true; // เฉพาะเจ้าของ
                    if (friendIds.length === 0 && post.status === "friend") return false; // ไม่มีเพื่อนในระบบ
                    return false; // ไม่แสดง
                });

                const finalPosts = [...filteredPosts, ...otherPagePosts];

                // กรองโพสต์ที่เป็น images และ videos
                const imagePosts = finalPosts.filter((post) =>
                    post.medias.some((media) => media.type === "image")
                );
                const videoPosts = finalPosts.filter((post) =>
                    post.medias.some((media) => media.type === "video")
                );

                // เตรียมข้อมูล populated
                const userIds = finalPosts.map((post) => post.userId);
                const users = await Users.find({ userId: { $in: userIds } });
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatePosts = async (posts) =>
                    Promise.all(
                        posts.map(async (post) => {
                            const comments = await Comment.find({ postId: post._id });
                            const commentUserIds = comments.map((comment) => comment.userId);
                            const commentUsers = await Users.find({
                                userId: { $in: commentUserIds },
                            });
                            const commentUserMap = commentUsers.reduce((acc, user) => {
                                acc[user.userId] = user;
                                return acc;
                            }, {});

                            const populatedComments = await Promise.all(
                                comments.map(async (comment) => {
                                    const replies = await Reply.find({
                                        commentId: comment._id,
                                    });
                                    const replyUserIds = replies.map((reply) => reply.userId);
                                    const replyUsers = await Users.find({
                                        userId: { $in: replyUserIds },
                                    });
                                    const replyUserMap = replyUsers.reduce((acc, user) => {
                                        acc[user.userId] = user;
                                        return acc;
                                    }, {});

                                    const populatedReplies = replies.map((reply) => ({
                                        ...reply._doc,
                                        user: replyUserMap[reply.userId],
                                    }));

                                    return {
                                        ...comment._doc,
                                        user: commentUserMap[comment.userId],
                                        reply: populatedReplies,
                                    };
                                })
                            );

                            return {
                                ...post._doc,
                                user: userMap[post.userId],
                                comments: populatedComments,
                            };
                        })
                    );

                const populatedPost = await populatePosts(finalPosts);
                const populatedImage = await populatePosts(imagePosts);
                const populatedVideo = await populatePosts(videoPosts);

                // ส่ง response
                res.status(200).json({
                    success: true,
                    data: populatedPost,
                    images: populatedImage,
                    video: populatedVideo,
                });
            } catch (error) {
                console.error("Error fetching posts:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}

import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import Level from "@/database/models/Level";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Post from "@/database/models/Post";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
    const { userId } = req.query;
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // Fetch user and employee details
                const user = await Users.findOne({ userId });
                const emp = await Emp.findOne({ empId: user.empId });

                // Calculate points
                const points = await Point.find({ userId });
                const pointData = points.reduce((acc, point) => {
                    if (point.type === "earn") {
                        acc.totalPoints += point.point;
                        acc.point += point.point;
                    } else if (point.type === "pay") {
                        acc.point -= point.point;
                    }
                    return acc;
                }, { point: 0, totalPoints: 0 });

                // Determine user level
                const levels = await Level.find().sort({ level: 1 });
                let userLevel = 1;
                let requiredPoints = 0;
                let nextLevelRequiredPoints = 0;

                for (const level of levels) {
                    if (pointData.totalPoints >= level.requiredPoints) {
                        userLevel = level.level;
                        requiredPoints = level.requiredPoints;
                    } else {
                        nextLevelRequiredPoints = level.requiredPoints;
                        break;
                    }
                }

                const pointResult = {
                    point: pointData.point,
                    totalPoints: pointData.totalPoints,
                };

                // Calculate coins
                const coins = await Coins.find({ userId });
                const totalEarn = coins.filter(coin => coin.type === "earn").reduce((sum, coin) => sum + coin.coins, 0);
                const totalPay = coins.filter(coin => coin.type === "pay").reduce((sum, coin) => sum + coin.coins, 0);
                const coinsData = {
                    totalCoins: totalEarn,
                    coins: totalEarn - totalPay,
                };

                // Fetch posts and include user details
                const posts = await Post.find({ userId }).sort({ createdAt: -1 });

                const populatedPosts = await Promise.all(
                    posts.map(async (post) => {
                        // Fetch user details for the post
                        const postUser = await Users.findOne({ userId: post.userId });

                        // Fetch and populate comments and replies with user details
                        const comments = await Comment.find({ postId: post._id });
                        const populatedComments = await Promise.all(
                            comments.map(async (comment) => {
                                const commentUser = await Users.findOne({ userId: comment.userId });
                                const replies = await Reply.find({ commentId: comment._id });

                                // Populate replies with user details
                                const populatedReplies = await Promise.all(
                                    replies.map(async (reply) => ({
                                        ...reply._doc,
                                        user: await Users.findOne({ userId: reply.userId }), // Add user details to reply
                                    }))
                                );

                                return {
                                    ...comment._doc,
                                    user: commentUser, // Add user details to comment
                                    replies: populatedReplies, // Include populated replies
                                };
                            })
                        );

                        return {
                            ...post._doc,
                            user: postUser, // Add user details to post
                            comments: populatedComments, // Include populated comments
                        };
                    })
                );

                res.status(200).json({
                    success: true,
                    data: {
                        user,
                        emp,
                        level: userLevel,
                        points: pointResult,
                        coins: coinsData,
                        posts: populatedPosts,
                    },
                });
            } catch (error) {
                console.error("Error in GET handler:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, error: "Method not allowed" });
            break;
    }
}

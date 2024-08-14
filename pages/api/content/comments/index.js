import connectMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";
import ReplyContentComment from "@/database/models/ReplyContentComment";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { contentId } = req.query;

                // Fetch all comments related to the contentId
                const comments = await ContentComment.find({ contentId }).sort({ createdAt: -1 }).lean();
                if (comments.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                }

                // Get all userIds from comments
                const commentUserIds = comments.map(comment => comment.userId);

                // Get all replyIds from comments
                const replyIds = comments.reduce((acc, comment) => {
                    return acc.concat(comment.reply);
                }, []);

                // Fetch all replies related to the comments
                const replies = await ReplyContentComment.find({ _id: { $in: replyIds } }).lean();

                // Get all userIds from replies
                const replyUserIds = replies.map(reply => reply.userId);

                // Combine comment and reply userIds
                const userIds = [...new Set([...commentUserIds, ...replyUserIds])];

                // Fetch all users related to the userIds
                const users = await Users.find({ userId: { $in: userIds } }).lean();

                // Create a map of userId to user details
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // Populate the user data in comments and their respective replies
                const populatedComments = comments.map(comment => ({
                    ...comment,
                    user: userMap[comment.userId] || null,
                    replies: replies.filter(reply => comment.reply.includes(reply._id.toString())).map(reply => ({
                        ...reply,
                        user: userMap[reply.userId] || null,
                    })),
                }));

                res.status(200).json({ success: true, data: populatedComments });
            } catch (error) {
                console.error('Error fetching comments:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const comment = await ContentComment.create(req.body);

                res.status(201).json({ success: true, data: comment });
            } catch (error) {
                console.error('Error creating comment:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
          
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}

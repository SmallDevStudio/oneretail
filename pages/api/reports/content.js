import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();
    switch (method) {
        case 'GET':
            try {
                let contents = await Content.find({})
                    .sort({ createdAt: -1 })
                    .populate('categories')
                    .populate('subcategories')
                    .populate('groups')
                    .populate('subgroups');

                // Manually populate author data
                const userIds = contents.map(content => content.author);
                const users = await Users.find({ userId: { $in: userIds } });
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const contentIds = contents.map(content => content._id);
                const comments = await ContentComment.find({ contentId: { $in: contentIds } });

                // Manually populate author data and modify content data
                contents = contents.map(content => {
                    content = content.toObject();
                    content.author = userMap[content.author] || null;
                    
                    // Count the number of comments
                    content.commentCount = comments.filter(comment => comment.contentId.equals(content._id)).length;
                    
                    // Count the number of likes
                    content.likeCount = content.likes.length;
                    
                    // Remove the comments and likes array from the response
                    delete content.comments;
                    delete content.likes;
                    
                    return content;
                });

                res.status(200).json({ success: true, data: contents });
            } catch (error) {
                console.error('Error fetching content:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

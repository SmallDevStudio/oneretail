// pages/api/content.js
import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Category from "@/database/models/Category"; // Ensure you have the Category model
import ContentComment from "@/database/models/ContentComment";
import ContentViews from "@/database/models/ContentViews"; // Import ContentViews

export default async function handler(req, res) {
    await connectMongoDB();
    const { method, query } = req;

    switch (method) {
        case 'GET':
            try {
                const { category, subcategory, group, limit = 10 } = query;
                let contentQuery = {};

                if (category) contentQuery.categories = category;
                if (subcategory) contentQuery.subcategories = subcategory;
                if (group) contentQuery.groups = group;

                // Fetch content
                let contents = await Content.find(contentQuery)
                    .sort({ views: -1 })
                    .limit(Number(limit))
                    .populate('categories')
                    .populate('subcategories')
                    .populate('groups');

                const contentIds = contents.map(content => content._id);

                // Fetch comments and views
                const comments = await ContentComment.find({ contentId: { $in: contentIds } });
                const contentViews = await ContentViews.find({ contentId: { $in: contentIds } });

                // Combine userIds from author, likes, comments, contentViews
                const userIds = [
                    ...new Set([
                        ...contents.map(content => content.author),
                        ...comments.map(comment => comment.user),
                        ...contentViews.map(view => view.userId),
                        ...contents.reduce((acc, content) => acc.concat(content.likes), [])
                    ])
                ];

                // Fetch users
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // Map content with authors and likes
                contents = contents.map(content => {
                    content = content.toObject();
                    content.author = userMap[content.author] || null;

                    // Map users in likes
                    content.likes = content.likes.map(like => userMap[like] || null);

                    // Map users in comments
                    content.comments = comments
                        .filter(comment => comment.contentId.equals(content._id))
                        .map(comment => ({
                            ...comment.toObject(),
                            user: userMap[comment.user] || null
                        }));

                    return content;
                });

                // Map users in contentViews
                const mappedContentViews = contentViews.map(view => ({
                    ...view.toObject(),
                    user: userMap[view.userId] || null
                }));

                // Return response
                res.status(200).json({ success: true, data: { contents, comments, contentViews: contentViews } });
            } catch (error) {
                console.error('Error fetching content:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}

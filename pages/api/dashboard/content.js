// pages/api/content.js
import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Category from "@/database/models/Category";  // Ensure you have the Category model

export default async function handler(req, res) {
    await connetMongoDB();
    const { method, query } = req;

    switch (method) {
        case 'GET':
            try {
                const categories = await Category.find();  // Fetch categories
                let contents;

                if (query.category) {
                    const category = await Category.findOne({ _id: query.category });
                    if (category) {
                        contents = await Content.find({ categories: category._id }).sort({ views: -1 })
                            .populate('categories')
                            .populate('subcategories')
                            .populate('groups');
                    } else {
                        contents = [];
                    }
                } else {
                    contents = await Content.find({}).sort({ views: -1 })
                        .populate('categories')
                        .populate('subcategories')
                        .populate('groups');
                }

                const userIds = contents.map(content => content.author);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                contents = contents.map(content => {
                    content = content.toObject();
                    content.author = userMap[content.author] || null;
                    return content;
                });

                res.status(200).json({ success: true, data: { contents, categories } });
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

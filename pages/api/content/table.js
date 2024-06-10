import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";


export default async function handler(req, res) {
    const { method, query } = req;
    await connetMongoDB();
    const { page , limit } = req.query;

    switch (method) {
        case 'GET':
            try {
                const contents = await Content.find({})
                    .populate('categories')
                    .populate('subcategories')
                    .populate('groups')
                    .skip((page - 1) * limit)
                    .limit(limit);

                const totalContents = await Content.countDocuments({});

                    // Manually populate author data
                const userIds = contents.map(content => content.author);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
                const userMap = users.reduce((acc, user) => {
                acc[user.userId] = user;
                return acc;
                }, {});
        
                const populatedContents = contents.map(content => {
                const author = userMap[content.author];
                return { ...content.toObject(), author };
                });

                res.status(200).json({ success: true, data: populatedContents, totalContents });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
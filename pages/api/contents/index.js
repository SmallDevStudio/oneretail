import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();

    if (req.method === "GET") {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;

            const query = search ? { title: { $regex: search, $options: 'i' } } : {};

            const contents = await Content.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .populate('categories')
                .populate('subcategories')
                .populate('groups')
                .populate('subgroups');

            const totalItems = await Content.countDocuments(query);

            // Manually populate author data
            const userIds = contents.map(content => content.author);
            const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
            const userMap = users.reduce((acc, user) => {
              acc[user.userId] = user;
              return acc;
            }, {});
    
            const populatedContents = contents.map(content => {
              content = content.toObject();
              content.author = userMap[content.author] || null;
              return content;
            });

            res.status(200).json({ success: true, data: populatedContents, totalItems });
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    }

    if (req.method === "POST") {
        console.log("Request body:", req.body);

        const { title, description, slug, author, categories, subcategories, groups, pinned, recommend } = req.body;

        if (!title || !description || !slug || !author) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        const sanitizedData = {
            ...req.body,
            categories: categories || null,
            subcategories: subcategories || null,
            groups: groups || null,
            pinned: pinned === '' ? false : pinned,
            recommend: recommend === '' ? false : recommend,
        };

        try {
            const content = await Content.create(sanitizedData);
            res.status(201).json(content);
        } catch (error) {
            console.error("Error creating content:", error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method, query } = req;

    switch (method) {
        case 'GET':
          try {
            let contents;
            if (query.category) {
              contents = await Content.find({ categories: query.category })
                .populate('categories')
                .populate('subcategories')
                .populate('groups');
            } else if (query.subcategory) {
              contents = await Content.find({ subcategories: query.subcategory })
                .populate('categories')
                .populate('subcategories')
                .populate('groups');
            } else if (query.group) {
              contents = await Content.find({ groups: query.group })
                .populate('categories')
                .populate('subcategories')
                .populate('groups');
            } else {
              contents = await Content.find({})
                .populate('categories')
                .populate('subcategories')
                .populate('groups');
            }
    
            // Manually populate author data
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
    
            res.status(200).json({ success: true, data: contents });
          } catch (error) {
            console.error('Error fetching content:', error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;

        case 'POST':
          try {
            const content = await Content.create(req.body);
            res.status(201).json({ success: true, data: content });
          } catch (error) {
            console.error('Error creating content:', error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: 'Invalid request method' });
          break;
      }
    }
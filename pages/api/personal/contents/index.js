import connetMongoDB from "@/lib/services/database/mongodb";
import PersonalizedContents from "@/database/models/PersonalizedContents";
import Users from "@/database/models/users";

export const config = {
    api: {
      responseLimit: false,
    },
  };

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const contents = await PersonalizedContents.find()
                .sort({ createdAt: -1 })
                .populate('contents');

                const userIds = contents.map(content => content.creator);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId empId fullname pictureUrl role');
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedContents = contents.map(content => {
                    const user = userMap[content.creator];
                    return {
                        ...content._doc,
                        creator: user || null, // หากไม่พบ user ให้ตั้งค่าเป็น null
                    };
                });

                res.status(200).json({ success: true, data: populatedContents });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        case 'POST':
            try {
                const group = await PersonalizedContents.create(req.body);
                res.status(201).json({ success: true, data: group });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
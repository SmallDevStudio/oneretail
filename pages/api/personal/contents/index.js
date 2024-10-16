import connetMongoDB from "@/lib/services/database/mongodb";
import ContentGen from "@/database/models/ContentGen";
import Users from "@/database/models/users";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                // ดึงข้อมูลจาก ContentGen ทั้งหมดและเรียงลำดับตาม createdAt
                const contentGenList = await ContentGen.find().sort({ createdAt: -1 });

                if (!contentGenList || contentGenList.length === 0) {
                    return res.status(404).json({ success: false, message: 'Content not found' });
                }

                // ดึง userIds ทั้งหมดที่อยู่ใน contentGen
                const userIds = contentGenList.map(content => content.creator);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
                
                // สร้าง map ของ users เพื่อให้ง่ายในการแทนค่าทีหลัง
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // ดึงข้อมูล contentIds ทั้งหมดที่อยู่ใน contentGen
                const allContentIds = contentGenList.flatMap(content => content.contents);
                const contentList = await Content.find({ _id: { $in: allContentIds } });

                // สร้าง map ของ contents
                const contentMap = contentList.reduce((acc, content) => {
                    acc[content._id] = content;
                    return acc;
                }, {});

                // แทนที่ creator ด้วยข้อมูลผู้ใช้ และ map ข้อมูล contents แต่ละ contentGen
                const contentGenWithDetails = contentGenList.map(contentGen => {
                    return {
                        ...contentGen.toObject(),
                        creator: userMap[contentGen.creator], // แทนที่ creator ด้วยข้อมูลผู้ใช้
                        contentsData: contentGen.contents.map(contentId => contentMap[contentId] || null), // map contents
                    };
                });

                // ส่งข้อมูลกลับไปยัง client
                res.status(200).json({ success: true, data: contentGenWithDetails });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
            
        case 'POST':
            try {
                const group = await ContentGen.create(req.body);
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
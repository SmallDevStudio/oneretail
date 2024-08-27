import connetMongoDB from "@/lib/services/database/mongodb";
import SocialClub from "@/database/models/SocialClub";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const socialclub = await SocialClub.find().sort({ createdAt: -1 });

                // Find all users related to the entries in socialclub
                const userIds = socialclub.map(socialclub => socialclub.userId);
                const users = await Users.find({ userId: { $in: userIds } });

                const empIds = socialclub.map(socialclub => socialclub.empId);
                const emps = await Users.find({ empId: { $in: empIds } });

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const formattedSocialClub = socialclub.map(item => ({
                    _id: item._id,
                    userId: item.userId,
                    empId: item.empId,
                    empName: item.empName,
                    options: item.options,
                    createdAt: item.createdAt,
                    creator: userMap[item.userId],  // Additional user details
                    emp: empMap[item.empId],     // Additional emp details
                }));

                res.status(200).json({ success: true, data: formattedSocialClub })
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const socialclub = await SocialClub.create(req.body);
                res.status(201).json({ success: true, data: socialclub });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
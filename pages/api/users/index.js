import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const users = await Users.find({});
                res.status(200).json({ users });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            const { userId } = req.query;
            
            try {
                const user = await Users.findOneAndUpdate({ userId: userId }, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!user) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
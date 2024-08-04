import connetMongoDB from "@/lib/services/database/mongodb";
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
                const users = await Users.find({});
                res.status(200).json({ users });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        
        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
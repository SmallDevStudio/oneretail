import connectMongoDB from "@/lib/services/database/mongodb";
import AdminAction from "@/database/models/AdminAction";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();
  
    if (req.method === 'GET') {
      try {
        const adminActions = await AdminAction.find({});
        const userIds = adminActions.map(action => action.adminId);
        const users = await Users.find({ userId: { $in: userIds } });
        
        const data = adminActions.map(action => {
          const user = users.find(user => user.userId === action.adminId);
          return {
            ...action._doc,
            adminName: user ? user.fullname : 'Unknown',
            adminPicture: user ? user.pictureUrl : '',
          };
        });
  
        res.status(200).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  }
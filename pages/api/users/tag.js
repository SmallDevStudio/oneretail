import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const { search } = req.query;
        let users = [];
        
        if (search) {
          const regex = new RegExp(search, 'i'); // สร้าง regex เพื่อใช้ในการค้นหา
          users = await Users.find({
            $or: [
              { fullname: regex },
              { empId: regex }
            ]
          });
        } else {
          users = await Users.find({});
        }

        res.status(200).json({ users, length: users.length });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

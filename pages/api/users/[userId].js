import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { userId } = req.query;
        await connetMongoDB();
        const user = await Users.findOne({ userId: userId });
        res.status(200).json({ user });
    } else if (req.method === 'PUT') {
        const { userId } = req.query;
        try {
          const user = await Users.findByIdAndUpdate(id, req.body, {
              new: true,
              runValidators: true
          });
          if (!user) {
              return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: user });
      } catch (error) {
          res.status(400).json({ success: false });
      }
      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }
};



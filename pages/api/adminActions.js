// pages/api/adminActions.js
import connectMongoDB from "@/lib/services/database/mongodb";
import AdminAction from "@/database/models/AdminAction";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    try {
      const { adminId, groupName } = req.body;

      if (!adminId || !groupName) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const adminAction = new AdminAction({
        adminId,
        groupName,
      });

      await adminAction.save();

      res.status(201).json({ success: true, data: adminAction });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const adminActions = await AdminAction.find({});
      res.status(200).json({ success: true, data: adminActions });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

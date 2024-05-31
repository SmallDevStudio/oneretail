import connetMongoDB from "@/lib/services/database/mongodb";
import Group from "@/database/models/groups";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const groups = await Group.find({});
        res.status(200).json(groups);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const group = await Group.create(req.body);
        res.status(201).json(group);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
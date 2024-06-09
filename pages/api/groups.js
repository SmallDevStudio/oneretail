import connetMongoDB from "@/lib/services/database/mongodb";
import Group from "@/database/models/Group";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const groups = await Group.find();
        res.status(200).json({ success: true, data: groups });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
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
    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const group = await Group.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(group);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Group.findByIdAndDelete(id);
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
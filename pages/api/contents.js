import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Category from "@/database/models/Category";
import Subcategory from "@/database/models/Subcategory";
import Group from "@/database/models/Group";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const contents = await Content.find({});
        res.status(200).json(contents);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const content = await Content.create(req.body);
        res.status(201).json(content);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const content = await Content.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(content);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Content.findByIdAndDelete(id);
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

import connetMongoDB from "@/lib/services/database/mongodb";
import Category from "@/database/models/Category";

export default async function handler(req, res) {
  await connetMongoDB();
  
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const category = await Category.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(category);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Category.findByIdAndDelete(id);
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
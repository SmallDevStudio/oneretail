import connetMongoDB from "@/lib/services/database/mongodb";
import Subcategory from "@/database/models/Subcategory";

export default async function handler(req, res) {
  await connetMongoDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const subcategories = await Subcategory.find().populate('category');
        res.status(200).json({ success: true, data: subcategories });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const subcategory = await Subcategory.create(req.body);
        res.status(201).json(subcategory);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const subcategory = await Subcategory.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(subcategory);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Subcategory.findByIdAndDelete(id);
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
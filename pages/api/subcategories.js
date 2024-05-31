import connetMongoDB from "@/lib/services/database/mongodb";
import SubCategory from "@/database/models/subcategories";

export default async function handler(req, res) {
  await connetMongoDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const subcategories = await SubCategory.find({});
        res.status(200).json(subcategories);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const subcategories = await SubCategory.create(req.body);
        res.status(201).json(subcategories);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id, ...data } = req.body;
        const subcategories = await SubCategory.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(subcategories);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await SubCategory.findByIdAndDelete(id);
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
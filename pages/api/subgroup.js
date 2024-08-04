import connetMongoDB from "@/lib/services/database/mongodb";
import SupGroup from "@/database/models/SubGroup";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            const subgroups = await SupGroup.find();
            res.status(200).json({ success: true, data: subgroups });
          } catch (error) {
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'POST':
          try {
            const subgroup = await SupGroup.create(req.body);
            res.status(201).json(subgroup);
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'PUT':
          try {
            const { id, ...data } = req.body;
            const subgroup = await SupGroup.findByIdAndUpdate(id, data, { new: true });
            res.status(200).json(subgroup);
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'DELETE':
          try {
            const { id } = req.query;
            await SupGroup.findByIdAndDelete(id);
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
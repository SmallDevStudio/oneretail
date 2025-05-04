import connetMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
  const { method } = req;
  const { publicId } = req.query;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const libraries = await Library.find().sort({
          createdAt: -1,
        });
        res.status(200).json({ success: true, data: libraries });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const library = await Library.create(req.body);
        res.status(201).json(library);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { id, ...data } = req.body;
        const library = await Library.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        if (!library) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: library });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      const { id } = req.query;

      try {
        const library = await Library.findOneAndDelete({ _id: id });
        if (!library) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: library });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}

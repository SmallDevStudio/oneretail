import connetMongoDB from "@/lib/services/database/mongodb";
import NewTabs from "@/database/models/News/NewTabs";

export default async function handler(req, res) {
  await connetMongoDB();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const tabs = await NewTabs.find();
        res.status(200).json({ success: true, data: tabs });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { name, value } = req.body;
        const exists = await NewTabs.findOne({ $or: [{ name }, { value }] });
        if (exists) {
          return res.status(409).json({ message: "ชื่อหรือ value ซ้ำกัน" });
        }

        const tab = await NewTabs.create({ name, value });
        return res.status(201).json(tab);
      } catch (error) {
        return res.status(400).json({ success: false });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}

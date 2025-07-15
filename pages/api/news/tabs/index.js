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
        const tabs = await NewTabs.create(req.body);
        res.status(201).json(tabs);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import NewGroups from "@/database/models/News/NewGroups";

export default async function handler(req, res) {
  await connetMongoDB();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const groups = await NewsGroup.find();
        res.status(200).json({ success: true, data: groups });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const group = await NewsGroup.create(req.body);
        res.status(201).json(group);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import TeamGroup from "@/database/models/Perf360/TeamGroup";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const teamGroups = await TeamGroup.find({});
        res.status(200).json({ success: true, data: teamGroups });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const teamGroup = await TeamGroup.create(req.body);
        res.status(201).json(teamGroup);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const teamGroup = await TeamGroup.findByIdAndUpdate(id, req.body);
        res.status(201).json(teamGroup);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        const teamGroup = await TeamGroup.findByIdAndDelete(id);
        res.status(201).json(teamGroup);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

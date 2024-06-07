import connetMongoDB from "@/lib/services/database/mongodb";
import Redeem from "@/database/models/Redeem";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
      try {
        const redeems = await Redeem.find({});
        res.status(200).json({ success: true, data: redeems });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
      case 'POST':
      try {
        const redeem = new Redeem(req.body);
        await redeem.save();
        res.status(201).json({ success: true, data: redeem });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const { id } = req.body;
        const redeem = await Redeem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!redeem) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: redeem });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        const deletedRedeem = await Redeem.findByIdAndDelete(id);
        if (!deletedRedeem) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
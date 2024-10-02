import connectMongoDB from "@/lib/services/database/mongodb";
import Redeem from "@/database/models/Redeem";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const redeems = await Redeem.find({status: true}).sort({ createdAt: -1 });
        const redeemsWithUser = await Promise.all(
          redeems.map(async (redeem) => {
            const user = await Users.findOne({ userId: redeem.creator });
            return {
              ...redeem._doc,
              creator: user ? user.pictureUrl : null, // Assuming user image is stored in the `image` field
            };
          })
        );
        res.status(200).json({ success: true, data: redeemsWithUser });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      // Create a new redeem
      console.log(req.body);
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
        const { id, ...updateData } = req.body;
        // Find the redeem and update it
        const redeem = await Redeem.findOne({ _id: id });
        if (!redeem) {
          return res.status(404).json({ success: false, message: 'Redeem not found' });
        }
        const updatedRedeem = await Redeem.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, data: updatedRedeem });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
        break;
        case 'DELETE':
          try {
              const { id } = req.query;
              if (!id) {
                  return res.status(400).json({ success: false, message: 'ID is required' });
              }
              const deletedRedeem = await Redeem.findByIdAndDelete(id);
              if (!deletedRedeem) {
                  return res.status(404).json({ success: false, message: 'Redeem not found' });
              }
              res.status(200).json({ success: true, data: {} });
          } catch (error) {
              res.status(400).json({ success: false, message: error.message });
          }
          break;
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}

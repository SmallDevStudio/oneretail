import connectMongoDB from "@/lib/services/database/mongodb";
import Redeem from "@/database/models/Redeem";
import Users from "@/database/models/users";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        // Find all active redeems and sort them by customOrder and createdAt
        const redeems = await Redeem.find({ status: true }).sort({ customOrder: 1, createdAt: -1 });

        // Group the redeems by `group` field
        const groupedRedeems = redeems.reduce((acc, redeem) => {
          const group = redeem.group || ''; // Default to empty string if no group
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(redeem);
          return acc;
        }, {});

        // Sort groups to display non-empty groups first and then empty ones
        const sortedGroups = Object.keys(groupedRedeems).sort((a, b) => {
          if (a === '') return 1; // Move empty groups ('') to the end
          if (b === '') return -1;
          return a.localeCompare(b); // Sort alphabetically for non-empty groups
        });

        // Map sorted groups into a structure for the response
        const sortedRedeems = sortedGroups.map(group => ({
          group,
          redeems: groupedRedeems[group]
        }));

        // Fetch creator details for each redeem and enrich the response
        const redeemsWithUser = await Promise.all(
          sortedRedeems.map(async (groupObj) => {
            const redeemsWithUser = await Promise.all(
              groupObj.redeems.map(async (redeem) => {
                const user = await Users.findOne({ userId: redeem.creator });
                return {
                  ...redeem._doc,
                  creator: user ? user.pictureUrl : null,
                };
              })
            );
            return { group: groupObj.group, redeems: redeemsWithUser };
          })
        );

        res.status(200).json({ success: true, data: redeemsWithUser });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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

    default:
      res.status(400).json({ success: false });
      break;
  }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import Friends from "@/database/models/Friends";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "PUT":
            const { requesterId, recipientId } = req.body;
            try {
                const friendRequest = await Friends.findOneAndUpdate(
                    { requester: requesterId, recipient: recipientId, status: 'pending' },
                    { status: 'accepted' },
                    { new: true }
                  );
                
                  if (!friendRequest) {
                    return res.status(400).json({ success: false, error: 'Friend request not found' });
                  }
                
                  res.status(200).json({ success: true, data: friendRequest });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
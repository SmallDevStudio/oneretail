import connetMongoDB from "@/lib/services/database/mongodb";
import Friends from "@/database/models/Friends";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    
    switch (method) {
        case "POST":
            const { requesterId, recipientId } = req.body;
            try {
                const existingRequest = await Friends.findOne({
                    requester: requesterId,
                    recipient: recipientId,
                  });
                
                  if (existingRequest) {
                    return res.status(400).json({ message: 'Friend request already sent.' });
                  }

                  const newFriendRequest = new Friends({ requester: requesterId, recipient: recipientId });
                  await newFriendRequest.save();

                  res.status(201).json({ message: 'Friend request sent successfully.' });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
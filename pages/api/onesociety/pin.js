import connetMongoDB from "@/lib/services/database/mongodb";
import PinPost from "@/database/models/PinPost";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method } = req;
    
    switch (method) {
        case "POST":
            const { postId, userId, pinned } = req.body;
                
                let hasPinned = true
                
                if (pinned) {
                    hasPinned = false
                } else {
                    hasPinned = true
                }

            try {
                const pinPost = await PinPost.findOne({ postId: postId});

                if (pinPost) {
                    await PinPost.findOneAndUpdate({ postId: postId }, { pinned: hasPinned });
                    res.status(200).json({ success: true, data: pinPost });
                } else {
                    const newPinPost = await PinPost.create({ postId: postId, userId: userId, pinned: hasPinned });
                    res.status(201).json({ success: true, data: newPinPost });
                }
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.query;
                const pinPost = await PinPost.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: pinPost });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
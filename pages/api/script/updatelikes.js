import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import mongoose from "mongoose";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'POST':
            try {
                // Find all contents
                const contents = await Content.find({});

                // Loop through each content and update the likes structure
                for (const content of contents) {
                    let needsUpdate = false;
                    const updatedLikes = content.likes.map(like => {
                        if (typeof like === 'string') {
                            needsUpdate = true;
                            return {
                                userId: like,
                                _id: new mongoose.Types.ObjectId(),
                                createAt: new Date(),
                            };
                        }
                        return like;
                    });

                    if (needsUpdate) {
                        // Update the content with the new likes structure
                        await Content.updateOne(
                            { _id: content._id },
                            { $set: { likes: updatedLikes } }
                        );
                    }
                }

                res.status(200).json({ success: true, message: 'Likes field updated successfully' });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Invalid request method' });
            break;
    }
}

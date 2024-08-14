import connetMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    await connetMongoDB();
    
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        // Find all documents in the ContentComment collection
        const comments = await ContentComment.find();

        for (let comment of comments) {
            const updateData = {};

            // Check if the 'medias' field exists, if not, add it as an empty array
            if (!comment.medias) {
                updateData.medias = [];
            }

            // Check if the 'files' field exists, if not, add it as an empty array
            if (!comment.files) {
                updateData.files = [];
            }

            // Check if the 'tagusers' field exists, if not, add it as an empty array
            if (!comment.tagusers) {
                updateData.tagusers = [];
            }

            // Check if the 'likes' field exists, if not, add it as an empty array
            if (!comment.likes) {
                updateData.likes = [];
            }

            // Check if the 'reply' field exists, if not, add it as an empty array
            if (!comment.reply) {
                updateData.reply = [];
            }

            // If there are any fields to update, update the document
            if (Object.keys(updateData).length > 0) {
                await ContentComment.updateOne({ _id: comment._id }, { $set: updateData });
            }
        }

        res.status(200).json({ success: true, message: "Migration completed successfully." });
    } catch (error) {
        console.error("Error during migration:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
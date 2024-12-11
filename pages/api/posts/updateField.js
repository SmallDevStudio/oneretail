import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Connect to the MongoDB database
        await connetMongoDB();

        // Update all posts by adding the `page` field with value 'share-your-story'
        const result = await Post.updateMany({}, { $set: { status: 'published' } });

        // Respond with the number of updated documents
        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} posts updated successfully.`,
        });
    } catch (error) {
        console.error('Error updating posts:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
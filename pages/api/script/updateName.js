import connectMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        await connectMongoDB(); // Establish a connection to the database

        const result = await ContentComment.updateMany(
            {},
            [
                {
                    $set: {
                        comment: "$content",
                        userId: "$user",
                    },
                },
                {
                    $unset: ["content", "user"],
                },
            ]
        );

        return res.status(200).json({
            success: true,
            message: `Successfully updated ${result.modifiedCount} documents.`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating field names.",
            error: error.message,
        });
    }
}
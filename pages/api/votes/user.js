import connetMongoDB from "@/lib/services/database/mongodb";
import Vote from "@/database/models/Vote";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            const { userId, topicId } = req.query;

            try {
                const votes = await Vote.find({ userId: userId, topicId: topicId });

                res.status(200).json({ success: true, data: votes });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

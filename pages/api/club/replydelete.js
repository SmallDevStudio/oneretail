// api/club/replydelete.js
import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'DELETE':
            const { replyId } = req.query;

            try {
                const reply = await ExperienceReplyComments.findById(replyId);

                if (!reply) {
                    return res.status(404).json({ success: false, error: "Reply not found" });
                }

                await ExperienceReplyComments.findByIdAndDelete(replyId);

                res.status(200).json({ success: true, data: reply });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }   
}

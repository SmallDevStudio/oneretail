// api/club/commentdelete.js
import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceComments from "@/database/models/ExperienceComments";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'DELETE':
            const { commentId } = req.query;

            try {
                const comment = await ExperienceComments.findById(commentId);

                if (!comment) {
                    return res.status(404).json({ success: false, error: "Comment not found" });
                }

                // Delete all replies related to the comment
                await ExperienceReplyComments.deleteMany({ commentId });

                // Delete the comment itself
                await ExperienceComments.findByIdAndDelete(commentId);

                res.status(200).json({ success: true, data: comment });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }   
}

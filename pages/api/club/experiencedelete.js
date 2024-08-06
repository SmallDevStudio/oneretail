// api/club/experiencedelete.js
import connectMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";
import ExperienceComments from "@/database/models/ExperienceComments";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'DELETE':
            const { experienceId } = req.query;

            try {
                const experience = await Experience.findById(experienceId);

                if (!experience) {
                    return res.status(404).json({ success: false, error: "Experience not found" });
                }

                // Find and delete all comments related to the experience
                const comments = await ExperienceComments.find({ experienceId });
                const commentIds = comments.map(comment => comment._id);

                // Delete all replies related to the comments
                await ExperienceReplyComments.deleteMany({ commentId: { $in: commentIds } });

                // Delete all comments related to the experience
                await ExperienceComments.deleteMany({ experienceId });

                // Delete the experience itself
                await Experience.findByIdAndDelete(experienceId);

                res.status(200).json({ success: true, data: experience });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }   
}

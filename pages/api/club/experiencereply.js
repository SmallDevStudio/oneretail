import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";
import ExperienceComments from "@/database/models/ExperienceComments";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();
    switch (method) {
        case "POST":
            try {
                const reply = await ExperienceReplyComments.create(req.body);
                await ExperienceComments.findByIdAndUpdate(req.body.experiencecommentId, {
                    $push: { reply: reply._id }
                });
                res.status(201).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "PUT":
            try {
                const { id, ...data } = req.body;
                const reply = await ExperienceReplyComments.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!reply) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "DELETE":
            try {
                const { id, experiencecommentId } = req.body;
                const reply = await ExperienceReplyComments.findByIdAndDelete(id);
                if (!reply) {
                    return res.status(400).json({ success: false });
                }
                await ExperienceComments.findByIdAndUpdate(experiencecommentId, {
                    $pull: { reply: id }
                });
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Method not supported" });
            break;
    }
}

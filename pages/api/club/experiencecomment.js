import connectMongoDB from "@/lib/services/database/mongodb";
import ExperienceComments from "@/database/models/ExperienceComments";
import Experience from "@/database/models/Experiences";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();
    switch (method) {
        case "POST":
            try {
                const comment = await ExperienceComments.create(req.body);
                await Experience.findByIdAndUpdate(req.body.experienceId, {
                    $push: { comments: comment._id }
                });
                res.status(201).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "PUT":
            try {
                const { id, ...data } = req.body;
                const comment = await ExperienceComments.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!comment) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "DELETE":
            try {
                const { id, experienceId } = req.body;
                const comment = await ExperienceComments.findByIdAndDelete(id);
                if (!comment) {
                    return res.status(400).json({ success: false });
                }
                await Experience.findByIdAndUpdate(experienceId, {
                    $pull: { comments: id }
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

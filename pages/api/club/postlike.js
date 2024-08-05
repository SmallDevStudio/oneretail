import connectMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "PUT":

            try {
                const { experienceId, userId } = req.body;
                const experience = await Experience.findById({_id: experienceId});
                if (!experience) {
                    return res.status(404).json({ success: false, error: "Post not found" });
                }

                if (experience.likes.includes(userId)) {
                    experience.likes = experience.likes.filter((like) => like !== userId);
                } else {
                    experience.likes.push(userId);
                }

                await experience.save();

                res.status(200).json({ success: true, data: experience });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }

            break;

        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}
import connetMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { id, pinned } = req.body;

                const experience = await Experience.findById(id);

                if (!experience) {
                    return res.status(404).json({ success: false, error: "Experience not found" });
                }

                experience.pinned = pinned;
                await experience.save();

                res.status(200).json(experience);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
    }
}
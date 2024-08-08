// api/club/like.js
import connectMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";
import Users from "@/database/models/users";
import Notifications from "@/database/models/Notification";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'PUT':
            const { experienceId, userId } = req.body;

            try {
                const experience = await Experience.findById(experienceId);

                if (!experience) {
                    return res.status(404).json({ success: false, error: "Experience not found" });
                }

                const alreadyLiked = experience.likes.some(like => like.userId === userId);
                const user = await Users.findOne({ userId: userId });

                if (alreadyLiked) {
                    experience.likes = experience.likes.filter(like => like.userId !== userId);
                } else {
                    experience.likes.push({ userId });

                    await Notifications.create({
                        userId: experience.userId,
                        description: `${user.fullname} ได้กด like โพสใน Experience`,
                        referId: experience._id,
                        path: 'Experience',
                        subpath: 'Post',
                        url: `${process.env.NEXTAUTH_URL}/club?tab=experience#${experience._id}`,
                        type: 'Like'
                    });
                }

                await experience.save();

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

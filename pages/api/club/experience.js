import connectMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";
import Users from "@/database/models/users";
import ExperienceComments from "@/database/models/ExperienceComments";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();
    switch (method) {
        case "GET":
            try {
                const experiences = await Experience.find({}).sort({ createdAt: -1 });
                const userIds = experiences.map(experience => experience.userId);
                const users = await Users.find({ userId: { $in: userIds } });
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedExperiences = await Promise.all(
                    experiences.map(async (experience) => {
                        const comments = await ExperienceComments.find({ experienceId: experience._id });
                        const commentUserIds = comments.map(comment => comment.userId);
                        const commentUsers = await Users.find({ userId: { $in: commentUserIds } });
                        const commentUserMap = commentUsers.reduce((acc, user) => {
                            acc[user.userId] = user;
                            return acc;
                        }, {});

                        const populatedComments = await Promise.all(comments.map(async (comment) => {
                            // ดึง replies ของ comment นี้
                            const replies = await ExperienceReplyComments.find({ commentId: comment._id });
                            const replyUserIds = replies.map(reply => reply.userId);
                            const replyUsers = await Users.find({ userId: { $in: replyUserIds } });
                            const replyUserMap = replyUsers.reduce((acc, user) => {
                                acc[user.userId] = user;
                                return acc;
                            }, {});

                            // รวมข้อมูล user กับ replies
                            const populatedReplies = replies.map(reply => ({
                                ...reply._doc,
                                user: replyUserMap[reply.userId]
                            }));

                            return {
                                ...comment._doc,
                                user: commentUserMap[comment.userId],
                                reply: populatedReplies // รวม replies
                            };
                        }));

                        return {
                            ...experience._doc,
                            user: userMap[experience.userId],
                            comments: populatedComments
                        };
                    })
                );

                res.status(200).json({ success: true, data: populatedExperiences });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "POST":
            try {
                const experience = await Experience.create(req.body);
                res.status(201).json({ success: true, data: experience });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "PUT":
            try {
                const { id, ...data } = req.body;
                const experience = await Experience.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!experience) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: experience });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        case "DELETE":
            try {
                const experience = await Experience.findByIdAndDelete(req.body.id);
                if (!experience) {
                    return res.status(400).json({ success: false });
                }
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

import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import Survey from "@/database/models/Survey";
import Users from "@/database/models/users";
import SurveyReply from "@/database/models/SurveyReply";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const { surveyId } = req.query;

                // Find the survey
                const survey = await Survey.findOne({ _id: surveyId });
                if (!survey) {
                    return res.status(404).json({ success: false, error: "Survey not found" });
                }

                // Fetch comments and populate replies
                let comments = await SurveyComments.find({ surveyId }).lean();
                comments = comments || [];  // Default to an empty array if no comments are found

                // Get userIds from comments and their replies
                const userIds = [
                    ...new Set([
                        ...comments.map(comment => comment.userId),
                        ...comments.flatMap(comment => comment.reply?.map(r => r.userId) || [])
                    ])
                ];

                // Fetch user details
                const users = await Users.find({ userId: { $in: userIds } }).select("userId fullname pictureUrl");
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // Process comments and their replies
                const processedComments = comments.map(comment => ({
                    ...comment,
                    user: userMap[comment.userId] || null,
                    reply: (comment.reply || []).map(replyId => {
                        const reply = SurveyReply.findById(replyId);
                        return {
                            ...reply.toObject(),
                            user: userMap[reply?.userId] || null,
                        };
                    })
                }));

                // Construct final response
                const response = {
                    ...survey.toObject(),
                    comments: processedComments
                };

                res.status(200).json({ success: true, data: response });
            } catch (error) {
                console.error("Error fetching survey comments:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}

import connectMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import Survey from "@/database/models/Survey";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import SurveyReply from "@/database/models/SurveyReply";

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const { surveyId } = req.query;

        // Find the survey
        const survey = await Survey.findOne({ _id: surveyId }).lean();
        if (!survey) {
          return res
            .status(404)
            .json({ success: false, error: "Survey not found" });
        }

        // Fetch survey user details
        const surveyUser = await Users.findOne({ userId: survey.userId })
          .select("userId fullname pictureUrl empId role")
          .lean();
        const surveyEmp = surveyUser
          ? await Emp.findOne({ empId: surveyUser.empId }).lean()
          : null;

        // Attach user and emp data to the survey
        survey.user = surveyUser || null;
        survey.emp = surveyEmp || null;

        // Fetch comments and populate replies
        let comments = await SurveyComments.find({ surveyId }).lean();
        comments = comments || []; // Default to an empty array if no comments are found

        // Get userIds from comments
        const userIds = [...new Set(comments.map((comment) => comment.userId))];

        // Fetch user details
        const users = await Users.find({ userId: { $in: userIds } }).select(
          "userId fullname pictureUrl empId role"
        );
        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        // Process comments and their replies
        const processedComments = await Promise.all(
          comments.map(async (comment) => {
            // Directly fetch user details for each reply
            const replies = await Promise.all(
              (comment.reply || []).map(async (replyId) => {
                const reply = await SurveyReply.findById(replyId).lean();
                if (reply) {
                  const replyUser = await Users.findOne({
                    userId: reply.userId,
                  })
                    .select("userId fullname pictureUrl empId role")
                    .lean();
                  return {
                    ...reply,
                    user: replyUser || null, // Directly attach user details
                  };
                }
                return null;
              })
            );

            return {
              ...comment,
              user: userMap[comment.userId] || null,
              reply: replies.filter((r) => r !== null), // Filter out null values in case of missing replies
            };
          })
        );

        // Construct final response
        const response = {
          ...survey,
          comments: processedComments,
        };

        res.status(200).json({ success: true, data: response });
      } catch (error) {
        console.error("Error fetching survey comments:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: "Method not allowed" });
      break;
  }
}

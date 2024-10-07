import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import SurveyComments from "@/database/models/SurveyComments";
import SurveyReply from "@/database/models/SurveyReply";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop, position, group, department, branch } = req.query;

            if (!startDate || !endDate || !teamGrop || !position || !group || !department || !branch) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop, position, group, department, branch"
                });
            }

            try {
                const surveys = await Survey.find({
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
                    }
                });

                const userIds = surveys.map(survey => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId empId fullname pictureUrl');
            
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                const empMap = emps.reduce((acc, emp) => {
                    if (!emp.teamGrop) {
                        console.log("Missing teamGrop for emp:", emp.empId);
                    }
                    acc[emp.empId] = emp;
                    return acc;
                }, {});
                
                const userMap = users.reduce((acc, user) => {
                    const empData = empMap[user.empId];
                    acc[user.userId] = {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: empData?.teamGrop || 'Unknown',
                        department: empData?.department || 'Unknown',
                        position: empData?.position || 'Unknown',
                        branch: empData?.branch || 'Unknown',
                        group: empData?.group || 'Unknown',
                    };
                    return acc;
                }, {});

                // Filter data by teamGrop, group, department, and branch
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    return (
                        user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase() &&
                        user?.position?.toLowerCase() === position?.toLowerCase() &&
                        user?.group?.toLowerCase() === group?.toLowerCase() &&
                        user?.department?.toLowerCase() === department?.toLowerCase() &&
                        user?.branch?.toLowerCase() === branch?.toLowerCase()
                    );
                });

                // Get all comments for the filtered surveys
                const surveyIds = filteredData.map(survey => survey._id);
                const comments = await SurveyComments.find({ surveyId: { $in: surveyIds } });
                const commentIds = comments.map(comment => comment._id);

                // Get all replies for the comments
                const replies = await SurveyReply.find({ commentId: { $in: commentIds } });

                // Get all userIds for comments and replies
                const commentUserIds = comments.map(comment => comment.userId);
                const replyUserIds = replies.map(reply => reply.userId);
                const allUserIds = [...new Set([...commentUserIds, ...replyUserIds])];
                const commentUsers = await Users.find({ userId: { $in: allUserIds } }).select('userId fullname pictureUrl');

                const commentUserMap = commentUsers.reduce((acc, user) => {
                    acc[user.userId] = {
                        userId: user.userId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                    };
                    return acc;
                }, {});

                // Map replies to their respective comments
                const replyMap = replies.reduce((acc, reply) => {
                    const user = commentUserMap[reply.userId];
                    if (!acc[reply.commentId]) {
                        acc[reply.commentId] = [];
                    }
                    acc[reply.commentId].push({
                        ...reply.toObject(),
                        user,
                    });
                    return acc;
                }, {});

                // Map comments to their respective surveys and include replies
                const commentMap = comments.reduce((acc, comment) => {
                    const user = commentUserMap[comment.userId];
                    acc[comment.surveyId] = acc[comment.surveyId] || [];
                    acc[comment.surveyId].push({
                        ...comment.toObject(),
                        user,
                        replies: replyMap[comment._id] || [],
                    });
                    return acc;
                }, {});

                // Map filtered surveys with comments
                const memoFilteredData = filteredData
                    .filter(survey => survey.memo && survey.memo.trim() !== "")
                    .map(survey => ({
                        id: survey._id,
                        userId: survey.userId,
                        empId: userMap[survey.userId].empId,
                        fullname: userMap[survey.userId].fullname,
                        teamGrop: userMap[survey.userId].teamGrop,
                        department: userMap[survey.userId].department,
                        position: userMap[survey.userId].position,
                        branch: userMap[survey.userId].branch,
                        group: userMap[survey.userId].group,
                        value: survey.value,
                        memo: survey.memo,
                        createdAt: survey.createdAt,
                        comments: commentMap[survey._id] || [], // Include comments
                    }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                res.status(200).json({ success: true, data: memoFilteredData });
            } catch (error) {
                console.error("Error fetching surveys:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, error: "Method not allowed" });
            break;
    }
}

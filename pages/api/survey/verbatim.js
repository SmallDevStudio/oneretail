import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import SurveyComments from "@/database/models/SurveyComments";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop, chief_th, position, group, department, branch, value } = req.query;

            if (!startDate || !endDate || !teamGrop) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop",
                });
            }

            try {
                // Build the query object dynamically
                const query = {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
                    },
                };

                // Add value filter if provided
                if (value) {
                    query.value = parseInt(value, 10); // Ensure value is treated as a number
                }

                const surveys = await Survey.find(query);

                // Fetch user data
                const userIds = surveys.map((survey) => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select("userId empId");

                const empIds = users.map((user) => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // Create user and employee maps
                const empMap = emps.reduce((acc, emp) => {
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
                        teamGrop: empData?.teamGrop || "Unknown",
                        department: empData?.department || "Unknown",
                        position: empData?.position || "Unknown",
                        branch: empData?.branch || "Unknown",
                        group: empData?.group || "Unknown",
                    };
                    return acc;
                }, {});

                // Filter data dynamically
                const filteredData = surveys.filter((survey) => {
                    const user = userMap[survey.userId];
                
                    // Check if the survey matches the filters
                    const matchesFilters =
                        user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase() &&
                        (!chief_th || user?.chief_th?.toLowerCase() === chief_th.toLowerCase()) &&
                        (!position || user?.position?.toLowerCase() === position.toLowerCase()) &&
                        (!group || user?.group?.toLowerCase() === group.toLowerCase()) &&
                        (!department || user?.department?.toLowerCase() === department.toLowerCase()) &&
                        (!branch || user?.branch?.toLowerCase() === branch.toLowerCase());
                
                    // Check if the survey value matches the query (if provided)
                    const matchesValue = value ? survey.value === parseInt(value, 10) : true;
                
                    return matchesFilters && matchesValue;
                });

                // Fetch and map comments for each survey
                const surveyIds = filteredData.map((survey) => survey._id);
                const comments = await SurveyComments.find({ surveyId: { $in: surveyIds } }).lean();

                const commentsGroupedBySurveyId = comments.reduce((acc, comment) => {
                    if (!acc[comment.surveyId]) {
                        acc[comment.surveyId] = [];
                    }
                    acc[comment.surveyId].push(comment);
                    return acc;
                }, {});

                // Merge surveys with comments
                const memoFilteredData = filteredData
                .filter((survey) => survey.memo && survey.memo.trim() !== "") // Ensure only non-empty memos are included
                .map((survey) => ({
                    id: survey._id,
                    userId: survey.userId,
                    empId: userMap[survey.userId]?.empId,
                    fullname: userMap[survey.userId]?.fullname,
                    teamGrop: userMap[survey.userId]?.teamGrop,
                    department: userMap[survey.userId]?.department,
                    position: userMap[survey.userId]?.position,
                    branch: userMap[survey.userId]?.branch,
                    group: userMap[survey.userId]?.group,
                    value: survey.value,
                    memo: survey.memo, // Include memo
                    createdAt: survey.createdAt,
                    comments: commentsGroupedBySurveyId[survey._id] || [], // Include comments
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt

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

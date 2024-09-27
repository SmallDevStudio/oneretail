import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop, group, department, branch } = req.query;

            if (!startDate || !endDate || !teamGrop || !group) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop, department"
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
                const users = await Users.find({ userId: { $in: userIds } }).select('userId empId');
            
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                const empMap = emps.reduce((acc, emp) => {
                    if (!emp.teamGrop) {
                        console.log("Missing teamGrop for emp:", emp.empId);  // Log missing teamGrop for empId
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
                        user?.group?.toLowerCase() === group?.toLowerCase() &&
                        user?.department?.toLowerCase() === department?.toLowerCase() &&
                        user?.branch?.toLowerCase() === branch?.toLowerCase()
                    );
                });

                // Filter only the records with memo not null or empty
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
                        createdAt: survey.createdAt
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

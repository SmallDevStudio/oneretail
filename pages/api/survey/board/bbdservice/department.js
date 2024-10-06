import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop, position, group, department } = req.query;

            if (!startDate || !endDate || !teamGrop || !position || !group || !department) {
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

                // Filter data by teamGrop, group, and department
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    return (
                        user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase() &&
                        user?.position?.toLowerCase() === position?.toLowerCase() &&
                        user?.group?.toLowerCase() === group?.toLowerCase() &&
                        user?.department?.toLowerCase() === department?.toLowerCase()
                    );
                });

                // Aggregate by branch and count values, including memoCount
                const branchData = filteredData.reduce((acc, survey) => {
                    const userBranch = userMap[survey.userId]?.branch;
                    if (!userBranch) return acc;

                    if (!acc[userBranch]) {
                        acc[userBranch] = { 
                            branch: userBranch, 
                            counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, 
                            total: 0, 
                            sum: 0, 
                            memoCount: 0,
                        };
                    }

                    acc[userBranch].counts[survey.value]++;
                    acc[userBranch].total++;
                    acc[userBranch].sum += survey.value;

                    // Count memos (non-null and non-empty)
                    if (survey.memo && survey.memo.trim() !== "") {
                        acc[userBranch].memoCount++;
                    }
                    return acc;
                }, {});

                // Calculate the average for each branch and convert the object into an array
                const branchDataArray = Object.values(branchData).map(branch => {
                    // Calculate the average, round to the nearest integer
                    branch.average = branch.total > 0 ? Math.round(branch.sum / branch.total) : 0;
                    return branch;
                });

                // Sort by average (ascending order)
                branchDataArray.sort((a, b) => a.average - b.average);

                res.status(200).json({ success: true, data: branchDataArray });
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

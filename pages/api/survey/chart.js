import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
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

                // Map user IDs
                const userIds = surveys.map(survey => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select("userId empId");

                // Map employee IDs
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // Map employee data
                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                // Map user data including employee details
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
                        group: empData?.group || null,
                        chief_th: empData?.chief_th || "Unknown",
                    };
                    return acc;
                }, {});

                // Dynamically filter data based on optional query parameters
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    if (!user || user.teamGrop?.toLowerCase() !== teamGrop.toLowerCase()) return false;

                    // Apply optional filters
                    if (chief_th && user.chief_th?.toLowerCase() !== chief_th.toLowerCase()) return false;
                    if (position && user.position?.toLowerCase() !== position.toLowerCase()) return false;
                    if (group && user.group?.toLowerCase() !== group.toLowerCase()) return false;
                    if (department && user.department?.toLowerCase() !== department.toLowerCase()) return false;
                    if (branch && user.branch?.toLowerCase() !== branch.toLowerCase()) return false;

                    return true;
                });

                // Aggregate by group and calculate counts, totals, and averages
                const groupData = filteredData.reduce((acc, survey) => {
                    const userGroup = userMap[survey.userId]?.group || "Unknown";
                    if (!acc[userGroup]) {
                        acc[userGroup] = {
                            group: userGroup,
                            counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                            memoCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                            total: 0,
                            sum: 0,
                        };
                    }

                    acc[userGroup].counts[survey.value]++;
                    acc[userGroup].total++;
                    acc[userGroup].sum += survey.value;

                    if (survey.memo?.trim()) {
                        acc[userGroup].memoCount[survey.value]++;
                    }

                    return acc;
                }, {});

                // Calculate average and sort results
                const groupDataArray = Object.values(groupData).map(group => {
                    group.average = group.total > 0 ? Math.round(group.sum / group.total) : 0;
                    return group;
                });

                groupDataArray.sort((a, b) => a.group.localeCompare(b.group));

                res.status(200).json({ success: true, data: groupDataArray });
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

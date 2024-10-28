import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop } = req.query;

            if (!startDate || !endDate || !teamGrop) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop"
                });
            }

            try {
                // Find surveys within the date range
                const surveys = await Survey.find({
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
                    }
                });

                // Find users and their corresponding employee data
                const userIds = surveys.map(survey => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId empId');

                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // Map employee data
                const empMap = emps.reduce((acc, emp) => {
                    if (!emp.teamGrop) {
                        console.log("Missing teamGrop for emp:", emp.empId);
                    }
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                // Map user data including the group
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
                        group: empData?.group || null,
                    };
                    return acc;
                }, {});

                // Filter data by teamGrop and allowed positions, skipping records without a group
                const allowedPositions = ["CSO", "ABM", "BPA"];
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    return (
                        user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase() &&
                        allowedPositions.includes(user?.position) &&
                        user?.group
                    );
                });

                // Aggregate by group and calculate counts, total, sum, and average
                const positionData = filteredData.reduce((acc, survey) => {
                    const userPosition = userMap[survey.userId]?.position;
                    if (!userPosition) return acc;

                    if (!acc[userPosition]) {
                        acc[userPosition] = {
                            position: userPosition,
                            counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                            total: 0,
                            sum: 0,
                            average: 0,
                            memoCount: 0,
                        };
                    }

                    acc[userPosition].counts[survey.value]++;
                    acc[userPosition].total++;
                    acc[userPosition].sum += survey.value;

                    // Count memos (non-null and non-empty)
                    if (survey.memo && survey.memo.trim() !== "") {
                        acc[userPosition].memoCount++;
                    }
                    return acc;
                }, {});

                // Calculate the average for each position and convert the object into an array
                const positionDataArray = Object.values(positionData).map(position => {
                    position.average = position.total > 0 ? Math.round(position.sum / position.total) : 0;
                    return position;
                });

                // Sort by position name (alphabetically)
                positionDataArray.sort((a, b) => a.position.localeCompare(b.position));

                res.status(200).json({ success: true, data: positionDataArray });
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

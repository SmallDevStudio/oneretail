import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { limit, offset, teamGroup } = req.query;

                const points = await Point.find({ type: 'earn' });
                const userPoints = points.reduce((acc, point) => {
                    const userId = point.userId.toString();
                    if (!acc[userId]) {
                        acc[userId] = { userId, totalPoints: 0, points: [] };
                    }
                    acc[userId].totalPoints += point.point;
                    acc[userId].points.push(point);
                    return acc;
                }, {});

                const userPointsArray = Object.values(userPoints);
                const users = await Users.find({ userId: { $in: userPointsArray.map(up => up.userId) } });

                const empIds = users.map(user => user.empId);
                const employees = await Emp.find({ empId: { $in: empIds } });

                let leaderboard = userPointsArray.map((up, index) => {
                    const user = users.find(u => u.userId === up.userId);
                    const employee = employees.find(e => e.empId === user?.empId);

                    return {
                        rank: undefined,
                        userId: up.userId,
                        fullname: user?.fullname || "Unknown User",
                        pictureUrl: user?.pictureUrl || null,
                        totalPoints: up.totalPoints,
                        empId: user?.empId || "Unknown EmpId",
                        teamGrop: employee?.teamGrop || "Unknown Team",
                        ...employee ? {
                            sex: employee.sex,
                            branch: employee.branch,
                            department: employee.department,
                            group: employee.group,
                            chief_th: employee.chief_th,
                            chief_eng: employee.chief_eng,
                            position: employee.position
                        } : {},
                        points: up.points
                    };
                });

                // Apply teamGroup filter if specified and not 'All'
                if (teamGroup && teamGroup !== 'All') {
                    leaderboard = leaderboard.filter(item => item.teamGrop === teamGroup);
                }

                // Sort by total points
                leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

                // Apply offset and limit to paginate results
                 // Handle limit and offset
                 if (limit === 'Infinity') {
                    leaderboard.forEach((item, index) => {
                        item.rank = index + 1;
                    });
                    res.status(200).json({ success: true, data: leaderboard });
                } else {
                    const numericLimit = parseInt(limit) || 10;
                    const numericOffset = parseInt(offset) || 0;

                    const limitedContentViews = leaderboard.slice(numericOffset, numericOffset + numericLimit);
                    limitedContentViews.forEach((item, index) => {
                        item.rank = numericOffset + index + 1;
                    });
                    res.status(200).json({ success: true, data: limitedContentViews });
                }

                
            } catch (error) {
                console.error('Error fetching rank data:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}

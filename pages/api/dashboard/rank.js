import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";  // Ensure you have the Emp model

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { limit = 10, offset = 0 } = req.query; // Default limit is 10 if not specified

                const points = await Point.find();
                const userPoints = points.reduce((acc, point) => {
                    const userId = point.userId.toString();
                    if (!acc[userId]) {
                        acc[userId] = { userId, totalPoints: 0, points: [] };
                    }
                    if (point.type === 'earn') {
                        acc[userId].totalPoints += point.point;
                    }
                    acc[userId].points.push(point); // Add each point detail
                    return acc;
                }, {});

                const userPointsArray = Object.values(userPoints);
                const users = await Users.find({ userId: { $in: userPointsArray.map(up => up.userId) } });

                // Map users to employees to get teamGrop
                const empIds = users.map(user => user.empId);
                const employees = await Emp.find({ empId: { $in: empIds } });

                let leaderboard = userPointsArray.map((up, index) => {
                    const user = users.find(u => u.userId === up.userId);
                    if (user) {
                        const employee = employees.find(e => e.empId === user.empId);
                        return {
                            rank: index + 1, // Rank is determined by position in sorted array
                            userId: up.userId,
                            fullname: user.fullname || "Unknown User",
                            pictureUrl: user.pictureUrl || null,
                            totalPoints: up.totalPoints,
                            points: up.points, // Include all point details
                            empId: user.empId || "Unknown EmpId",
                            teamGrop: employee ? employee.teamGrop : "Unknown Team",
                            sex: employee ? employee.sex : null,
                            branch: employee ? employee.branch : null,
                            department: employee ? employee.department : null,
                            group: employee ? employee.group : null,
                            chief_th: employee ? employee.chief_th : null,
                            chief_eng: employee ? employee.chief_eng : null,
                            position: employee ? employee.position : null
                        };
                    } else {
                        return {
                            rank: index + 1, // Rank is determined by position in sorted array
                            userId: up.userId,
                            fullname: "Unknown User",
                            pictureUrl: null,
                            totalPoints: up.totalPoints,
                            points: up.points, // Include all point details
                            empId: "Unknown EmpId",
                            teamGrop: "Unknown Team"
                        };
                    }
                });

                // Sort by totalPoints descending
                leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

                // Limit to the specified number of records
                const limitedLeaderboard = leaderboard.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

                // Update rank based on the sorted and limited array
                limitedLeaderboard.forEach((item, index) => {
                    item.rank = parseInt(offset) + index + 1;
                });

                res.status(200).json({ success: true, data: limitedLeaderboard });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
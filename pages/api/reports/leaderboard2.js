import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            const { position, endDate } = req.query; // Get position and endDate from query params

            try {
                // Define start and end dates
                const startDate = new Date('2024-08-15T00:00:00Z');
                const parsedEndDate = endDate ? new Date(endDate) : new Date(); // Parse the endDate or use current date
                parsedEndDate.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

                // Fetch points data for users within the date range
                const points = await Point.find({
                    createdAt: { $gte: startDate, $lte: parsedEndDate }
                });

                // Aggregate points by userId
                const userPoints = points.reduce((acc, point) => {
                    const userId = point.userId.toString();
                    if (!acc[userId]) {
                        acc[userId] = { userId, totalPoints: 0 };
                    }
                    if (point.type === 'earn') {
                        acc[userId].totalPoints += point.point;
                    }
                    return acc;
                }, {});

                // Convert to array
                const userPointsArray = Object.values(userPoints);

                // Fetch user data
                const users = await Users.find({
                    userId: { $in: userPointsArray.map(up => up.userId) }
                });

                // Fetch employee data using empId
                const empData = await Emp.find({
                    empId: { $in: users.map(user => user.empId) }
                });

                // Filter empData by position if position query is provided
                let filteredEmpData = empData;
                if (position) {
                    filteredEmpData = empData.filter(emp => emp.position === position);
                }

                // Build leaderboard by merging user data, emp data, and points
                const leaderboard = userPointsArray
                    .map(up => {
                        const user = users.find(u => u.userId === up.userId);
                        const emp = filteredEmpData.find(e => e.empId === user?.empId);

                        // Only return data if emp exists and matches the filtered position (if any)
                        if (!emp) return null;

                        return {
                            userId: up.userId,
                            fullname: user ? user.fullname : "Unknown User",
                            empId: emp ? emp.empId : "Unknown EmpId",
                            teamGrop: emp ? emp.teamGrop : "Unknown TeamGrop",
                            position: emp ? emp.position : "Unknown Position",
                            totalPoints: up.totalPoints,
                        };
                    })
                    .filter(item => item !== null); // Remove null entries where emp data is not available

                // Sort leaderboard by total points in descending order
                leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

                // Return response
                res.status(200).json({ success: true, data: leaderboard });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}

import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();
    
    try {
        // Get all points
        const points = await Point.find();

        // Aggregate points for each user
        const userPoints = points.reduce((acc, point) => {
            const userId = point.userId.toString();
            if (!acc[userId]) {
                acc[userId] = { userId, earn: 0, pay: 0 };
            }
            if (point.type === 'earn') {
                acc[userId].earn += point.point;
            } else if (point.type === 'pay') {
                acc[userId].pay += point.point;
            }
            return acc;
        }, {});

        // Convert to array and add computed points
        const userPointsArray = Object.values(userPoints).map(up => ({
            ...up,
            point: up.earn - up.pay
        }));

        // Calculate total points earned
        const totalEarn = userPointsArray.reduce((sum, user) => sum += user.earn, 0);

        // Add total points to response
        res.status(200).json({
            success: true,
            data: {
                points: userPointsArray,
                total: totalEarn
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
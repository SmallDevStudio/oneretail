import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Level from "@/database/models/Level";
import calculateLevel from "@/utils/calculateLevel";


export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                // Calculate the total points for the user
                const points = await Point.aggregate([
                    { $match: { userId, type: "earn" } },
                    { $group: { _id: "$userId", totalPoints: { $sum: "$point" } } },
                ]);

                console.log(points);

                const totalPoints = points.length > 0 ? points[0].totalPoints : 0;

                // Calculate the user's level
                const userLevel = await calculateLevel(totalPoints);

                res.status(200).json({ success: true, level: userLevel, totalPoints });

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
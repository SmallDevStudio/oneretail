import connectMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                await connectMongoDB();

                // Fetch all points data
                const points = await Point.find();

                // Initialize totals
                let totalEarn = 0;
                let totalPay = 0;

                // Calculate total earn and pay points
                points.forEach(point => {
                    if (point.type === 'earn') {
                        totalEarn += point.point; // Sum earn points
                    } else if (point.type === 'pay') {
                        totalPay += point.point; // Sum pay points
                    }
                });

                // Calculate total points (earn - pay)
                const totalPoint = totalEarn - totalPay;

                // Return structured data
                res.status(200).json({
                    success: true,
                    data: {
                        earn: totalEarn,
                        pay: totalPay,
                        totalpoint: totalPoint
                    }
                });
            } catch (error) {
                console.error("Error fetching points:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

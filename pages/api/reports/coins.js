import connectMongoDB from "@/lib/services/database/mongodb";
import Coins from "@/database/models/Coins";

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
                const coins = await Coins.find();

                // Initialize totals
                let totalEarn = 0;
                let totalPay = 0;

                // Calculate total earn and pay points
                coins.forEach(coin => {
                    if (coin.type === 'earn') {
                        totalEarn += coin.coins; // Sum earn points
                    } else if (coin.type === 'pay') {
                        totalPay += coin.coins; // Sum pay points
                    }
                });

                // Calculate total points (earn - pay)
                const totalCoins = totalEarn - totalPay;

                // Return structured data
                res.status(200).json({
                    success: true,
                    data: {
                        earn: totalEarn,
                        pay: totalPay,
                        totalCoins: totalCoins
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

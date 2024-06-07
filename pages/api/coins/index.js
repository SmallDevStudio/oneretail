import connetMongoDB from "@/lib/services/database/mongodb";
import Coins from "@/database/models/Coins";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === 'GET') {
        try {
            const coins = await Coins.find({});
            const userCoins = coins.reduce((acc, coins) => {
                const userId = coins.userId.toString();
                if (!acc[userId]) {
                  acc[userId] = { userId, totalCoins: 0 };
                }
                if (coins.type === 'earn') {
                  acc[userId].totalCoins += coins.coins;
                } else if (coins.type === 'pay') {
                  acc[userId].totalCoins -= coins.coins;
                }
                return acc;
              }, {});

            const userCoinsArray = Object.values(userCoins);
            const users = await Users.find({ userId: { $in: userCoinsArray.map(up => up.userId) } });

            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
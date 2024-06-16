import connetMongoDB from "@/lib/services/database/mongodb";
import UserInfo from "@/database/models/UserInfo";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Level from "@/database/models/Level";

export default async function handler(req, res) {
    await connetMongoDB();

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch point transactions
        const pointTransactions = await Point.find({ userId });
        const totalPoints = pointTransactions
            .filter(pt => pt.type === 'earn')
            .reduce((acc, pt) => acc + pt.point, 0);
        const points = pointTransactions
            .reduce((acc, pt) => acc + (pt.type === 'earn' ? pt.point : -pt.point), 0);

        // Fetch coin transactions
        const coinTransactions = await Coins.find({ userId });
        const coins = coinTransactions
            .reduce((acc, ct) => acc + (ct.type === 'earn' ? ct.coins : -ct.coins), 0);

        // Calculate level based on totalPoints
        const levels = await Level.find().sort({ requiredPoints: 1 });
        console.log("Levels: ", levels);
        let level = 1;
        for (let i = 0; i < levels.length; i++) {
            console.log(`Checking level ${levels[i].level} with requiredPoints ${levels[i].requiredPoints}`);
            if (totalPoints >= levels[i].requiredPoints && (i === levels.length - 1 || totalPoints < levels[i + 1].requiredPoints)) {
                level = levels[i].level;
                break;
            }
        }
        console.log(`Determined level: ${level} for totalPoints: ${totalPoints}`);

        // Update or create userInfo
        const userInfo = await UserInfo.findOneAndUpdate(
            { userId },
            { totalPoints, points, coins, level },
            { new: true, upsert: true }
        );

        res.status(200).json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

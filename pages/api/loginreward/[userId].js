import connetMongoDB from "@/lib/services/database/mongodb";
import LoginReward from "@/database/models/LoginReward";
import Point from "@/database/models/Point";

export default async function handler(req, res) {
    await connetMongoDB();

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    if (req.method === 'GET') {
        try {
        const existingReward = await LoginReward.findOne({ userId });
        const today = new Date().toDateString();

        if (existingReward && new Date(existingReward.lastLogin).toDateString() === today) {
            return res.status(200).json({ receivedPointsToday: true });
        }

        return res.status(200).json({ receivedPointsToday: false });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
        }
    }

    if (req.method === 'POST') {
        try {
        const existingReward = await LoginReward.findOne({ userId });

        let newPoints = 1;
        let day = 1;

        if (!existingReward) {
            await LoginReward.create({ userId, day, lastLogin: new Date() });
            newPoints = 50;
        } else {
            const lastLogin = new Date(existingReward.lastLogin);
            const today = new Date();

            if (lastLogin.toDateString() === today.toDateString()) {
            return res.status(400).json({ error: 'Already received points today' });
            }

            day = existingReward.day >= 30 ? 1 : existingReward.day + 1;
            await LoginReward.updateOne({ userId }, { day, lastLogin: today });
        }

        await Points.create({
            userId,
            description: 'Login Reward',
            type: 'earn',
            points: newPoints,
        });

        // ส่งข้อความไปที่ LINE
        const message = `คุณได้รับ ${newPoints} คะแนนจากการLogin Reward!`;
        sendLineMessage(userId, message);

        return res.status(200).json({ message: 'Points added', points: newPoints });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};
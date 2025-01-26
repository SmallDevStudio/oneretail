import connetMongoDB from "@/lib/services/database/mongodb";
import Follower from "@/database/models/OneSociety/Follower";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const { userId } = req.query;

                // ดึงข้อมูล follower
                const followers = await Follower.find({ userId, type: "follow" })
                .sort({ createdAt: -1, friends: 1 })
                .lean();
                const userIds = followers.map((follower) => follower.targetId);
                const users = await Users.find({ userId: { $in: userIds } });

                // รวมข้อมูล user เข้ากับ followers
                followers.forEach((follower) => {
                    const user = users.find((user) => user.userId === follower.targetId);
                    follower.user = user;
                });

                res.status(200).json({ success: true, data: followers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "POST":
            try {
                const { userId, targetId, type } = req.body;

                // ค้นหาว่ามีความสัมพันธ์อยู่แล้วหรือไม่
                const follower = await Follower.findOne({ userId, targetId });

                if (follower) {
                    // อัปเดต type
                    follower.type = type;

                    // ตรวจสอบว่าทั้งสองฝ่าย follow กัน
                    const reciprocalFollow = await Follower.findOne({
                        userId: targetId,
                        targetId: userId,
                        type: "follow",
                    });

                    // อัปเดตสถานะ friends
                    if (reciprocalFollow && type === "follow") {
                        follower.friends = "yes";
                        reciprocalFollow.friends = "yes";
                        await reciprocalFollow.save();
                    } else {
                        follower.friends = "no";
                        if (reciprocalFollow) {
                            reciprocalFollow.friends = "no";
                            await reciprocalFollow.save();
                        }
                    }

                    await follower.save();
                    res.status(200).json({ success: true, data: follower });
                } else {
                    // สร้างความสัมพันธ์ใหม่
                    const newFollower = await Follower.create({ userId, targetId, type });

                    // ตรวจสอบว่ามีการ follow ตอบกลับหรือไม่
                    const reciprocalFollow = await Follower.findOne({
                        userId: targetId,
                        targetId: userId,
                        type: "follow",
                    });

                    if (reciprocalFollow && type === "follow") {
                        newFollower.friends = "yes";
                        reciprocalFollow.friends = "yes";
                        await reciprocalFollow.save();
                    }

                    await newFollower.save();
                    res.status(201).json({ success: true, data: newFollower });
                }
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
}

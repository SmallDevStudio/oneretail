import connectMongoDB from "@/lib/services/database/mongodb";
import Friends from "@/database/models/Friends";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                // ค้นหาเพื่อนที่เกี่ยวข้องกับ userId
                const friends = await Friends.find({
                    $or: [
                        { requester: userId, status: 'accepted' },
                        { recipient: userId, status: 'accepted' },
                    ],
                });

                // ดึง userId ของ requester และ recipient
                const userIds = friends.map((friend) => 
                    friend.requester === userId ? friend.recipient : friend.requester
                );

                // ดึงข้อมูลผู้ใช้จาก Users แบบ manual
                const users = await Users.find({ userId: { $in: userIds } });

                // จับคู่ข้อมูลเพื่อน
                const friendList = friends.map((friend) => {
                    const isRequester = friend.requester === userId;
                    const friendUserId = isRequester ? friend.recipient : friend.requester;

                    const friendData = users.find((user) => user.userId === friendUserId);

                    return {
                        fullname: friendData?.fullname || '',
                        pictureUrl: friendData?.pictureUrl || '',
                        userId: friendData?.userId || '',
                        empId: friendData?.empId || '',
                        friendId: friend._id, // ID ของความสัมพันธ์เพื่อน
                    };
                });

                res.status(200).json({ success: true, data: friendList });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}

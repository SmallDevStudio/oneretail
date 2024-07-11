import connectMongoDB from "@/lib/services/database/mongodb";
import ClubLeaderBoard from "@/database/models/ClubLeaderBoard";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();

    try {
        const clubLeaderBoardData = await ClubLeaderBoard.find();
        const usersData = await Users.find({});

        const groupedData = clubLeaderBoardData.reduce((acc, item) => {
            const rewardtype = item.rewerdtype || "Others";
            if (!acc[rewardtype]) acc[rewardtype] = [];
            
            const user = usersData.find(u => u.empId === item.empId);
            acc[rewardtype].push({
                ...item._doc,
                pictureUrl: user ? user.pictureUrl : null
            });
            return acc;
        }, {});

        res.status(200).json({ success: true, data: groupedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

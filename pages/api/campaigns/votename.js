import connetMongoDB from "@/lib/services/database/mongodb";
import VoteName from "@/database/models/VoteName";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            const { page = 1, limit = 10 } = req.query;
            try {
                const voteNames = await VoteName.find()
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .exec();

                    const count = await VoteName.countDocuments();

                    const voteNamesWithUserDetails = await Promise.all(voteNames.map(async (vote) => {
                        const user = await Users.findOne({ userId: vote.userId });
                        return {
                            ...vote._doc,
                            user
                        };
                    }));
                    
                    const VoteNameData = {
                        voteNames: voteNamesWithUserDetails,
                        totalPages: Math.ceil(count / limit),
                        currentPage: page
                    }
                res.status(200).json({ success: true, data: VoteNameData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            const { name, description, userId } = req.body;

            try {
                // Check if the user has already submitted a name
                const existingEntry = await VoteName.findOne({ userId });
                if (existingEntry) {
                    return res.status(400).json({ message: "คุณเคยส่งชื่อประกวดแล้ว" });
                }

                // Create a new entry
                const newEntry = new VoteName({
                    name,
                    description,
                    userId
                });

                await newEntry.save();

            res.status(200).json({ message: "ชื่อประกวดถูกส่งเรียบร้อยแล้ว" });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}
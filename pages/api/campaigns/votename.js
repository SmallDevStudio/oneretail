import connetMongoDB from "@/lib/services/database/mongodb";
import VoteName from "@/database/models/VoteName";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const voteNames = await VoteName.find();
                res.status(200).json({ success: true, data: voteNames });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            const { name, description, userId } = req.body;
            console.log(name, description, userId);
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
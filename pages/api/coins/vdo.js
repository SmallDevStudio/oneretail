import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Coins from "@/database/models/Coins";

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "POST":
            try {
                // List of empIds to give coins to
                const empIds = [
                    "86404", "86405", "86409", "54011", "86412", "55231", "86406", "86408", 
                    "58636", "86017", "86022", "86024", "57361", "56357", "42216", "86023", 
                    "86025", "59023", "85910", "85912", "85917", "53070", "58081", "56249", 
                    "57210", "58287", "85915", "85950", "85911", "57537", "58359", "54675", 
                    "85948", "57207", "60212", "86560", "86121", "86118", "86163", "86124", 
                    "86130", "54441", "57905", "86135", "86150", "60199", "86148", "86164", 
                    "86131", "86133", "57904", "86800", "86801", "86802", "86803", "53091", 
                    "58325", "60379", "86821", "86808", "58088", "86960", "86966", "86965", 
                    "86963", "57536", "60211", "87016", "59657", "87007", "86981", "55358", 
                    "86993", "53387", "86976", "59658"
                ];

                // Fetch the users based on the empId
                const users = await Users.find({ empId: { $in: empIds } });

                // Prepare the data to insert into the Coins collection
                const coinsData = users.map(user => ({
                    userId: user.userId,
                    description: 'VDO Clip RL ยอดเยี่ยม',
                    referId: null,
                    path: 'VDO Clip',
                    subpath: '',
                    type: 'earn',
                    coins: 750,
                }));

                // Insert the data into the Coins collection
                const insertedCoins = await Coins.insertMany(coinsData);

                res.status(201).json({ success: true, data: insertedCoins });
            } catch (error) {
                console.error("Failed to give coins:", error);
                res.status(500).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

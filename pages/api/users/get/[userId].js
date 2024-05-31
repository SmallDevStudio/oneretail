import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { userId } = req.query;
        await connetMongoDB();
        const user = await Users.findOne({ userId });
        res.status(200).json({ user });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

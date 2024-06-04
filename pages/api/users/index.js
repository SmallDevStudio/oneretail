import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const users = await Users.find({});
        res.status(200).json(users);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
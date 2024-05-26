import connetMongoDB from "@/services/database/mongoose/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const line_id = req.query.line_id;
        await connetMongoDB();
        const user = await Users.findOne({ line_id });
        res.status(200).json({ user });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
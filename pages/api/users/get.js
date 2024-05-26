import connetMongoDB from "@/services/database/mongoose/mongodb";
import Users from "@/database/models/users";


export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed !!!" });
    } else {
        await connetMongoDB();
        const users = await Users.find();
        res.status(200).json({ users });
    }
}
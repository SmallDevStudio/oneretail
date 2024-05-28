import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB()
        const users = await Users.find();
        res.status(200).json({ users });
    } else if (req.method === "POST") {
        const { fullname, phone, address, pictureUrl, role, active, empId, userId } = req.body;
        await connetMongoDB();
        await Users.create({ fullname, phone, address, pictureUrl, role, active, empId, userId });
        res.status(201).json({ message: "User created successfully" });
    }
}
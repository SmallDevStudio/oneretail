import connetMongoDB from "@/services/database/mongoose/mongodb";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const employee_id = req.query.employee_id;
        await connetMongoDB();
        const user = await Users.findOne({ employee_id });
        res.status(200).json({ user });
    } else if (req.method === "PUT") {

        const employee_id = req.query.employee_id;
        await connetMongoDB();
        const user = await Users.findOneAndUpdate({ employee_id }, req.body, { new: true });
        res.status(200).json({ user });
    } else if (req.method === "DELETE") {

        const employee_id = req.query.employee_id;
        await connetMongoDB();
        const user = await Users.findOneAndDelete({ employee_id });
        res.status(200).json({ user });
    }
}
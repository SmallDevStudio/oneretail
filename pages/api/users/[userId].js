import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { userId } = req.query;
        await connetMongoDB();
        const user = await Users.findOne({ userId });
        const emp = await Emp.findOne({ empId: user.empId });
        res.status(200).json({ user, emp });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

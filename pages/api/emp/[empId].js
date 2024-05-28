import connetMongoDB from "@/lib/services/database/mongodb";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { empId } = req.query;
        await connetMongoDB();
        const emp = await Emp.findOne({ empId: empId });
        res.status(200).json({ emp });
        
    } else if (req.method === "PUT") {

    } else if (req.method === "DELETE") {

    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
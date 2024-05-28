import connetMongoDB from "@/lib/services/database/mongodb";
import Emp from "@/database/models/emp";
export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const emps = await Emp.find({});
        res.status(200).json({ emps });
    } else if (req.method === "POST") {
        const { empId, teamGrop, sex, branch, department, group, chief_th, chief_eng, position } = req.body;
        await connetMongoDB();
        await Emp.create({ empId, teamGrop, sex, branch, department, group, chief_th, chief_eng, position });
        res.status(201).json({ message: "Emp created successfully" });
    }
}
import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    await connetMongoDB();
    if (req.method === "GET") {
       try {
           const users = await Users.find({});

           if (users.length === 0) {
               return res.status(400).json({ success: false, error: "No users found" });
           }

           const empId = users.map(user => user.empId);
           const emps = await Emp.find({ empId: { $in: empId } });
           const empMap = emps.reduce((acc, emp) => {
               acc[emp.empId] = emp;
               return acc;
           }, {});

           const populatedUsers = users.map(user => {
               user = user.toObject();
               user.emp = empMap[user.empId] || null;
               return user;
           });
           return res.status(200).json({ success: true, data: populatedUsers });
       } catch (error) {
           return res.status(400).json({ success: false, error: error.message });
       }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
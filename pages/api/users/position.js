import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export const config = {
    api: {
      responseLimit: false,
    },
  };

export default async function handler(req, res) {
    await connectMongoDB();
    const { position } = req.query;

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
                const emp = empMap[user.empId] || {};
                return {
                    ...user,
                    teamGrop: emp.teamGrop,
                    sex: emp.sex,
                    branch: emp.branch,
                    department: emp.department,
                    group: emp.group,
                    chief_th: emp.chief_th,
                    chief_eng: emp.chief_eng,
                    position: emp.position,
                    branch_en: emp.branch_en,
                    department_en: emp.department_en,
                    group_en: emp.group_en,
                    position2: emp.position2,
                    position3: emp.position3,
                };
            });
            if (!position) {
                return res.status(200).json({ success: true, data: populatedUsers });
            } else {
                const filteredUsers = populatedUsers.filter(user => user.position === position);
                return res.status(200).json({ success: true, data: filteredUsers });
            }

        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
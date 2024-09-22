import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const users = await Users.findOne({ userId });
                const emp = await Emp.findOne({ empId: users.empId });
                if (!emp) {
                    const user = {
                        ...users._doc,
                        emp: null,
                        teamGrop: null
                    };
                    return res.status(200).json({ user });
                }else{
                    const user = {
                        ...users._doc,
                        teamGrop: emp.teamGrop? emp.teamGrop : null,
                        position: emp.position? emp.position : null,
                        branch: emp.branch,
                        department: emp.department,
                        group: emp.group,
                        chief_th: emp.chief_th,
                        chief_eng: emp.chief_eng,
                        branch_en: emp.branch_en,
                        department_en: emp.department_en,
                        group_en: emp.group_en,
                        position2: emp.position2,
                        position3: emp.position3,
                    }
                    res.status(200).json({ user });
                }
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const data = req.body;
                const user = await Users.findOneAndUpdate({ userId: userId }, data, {
                    new: true,
                });
                if (!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }

            break;

        case "DELETE":
            try {
                const user = await Users.findOneAndDelete({ userId });
                if (!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                res.status(200).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
};



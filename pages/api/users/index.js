import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const users = await Users.find({});
        const userEmpDetail = await Promise.all(users.map(async (user) => {
            const emp = await Emp.findOne({ empId: user.empId });
            return { 
                userId: user.userId,
                fullname: user.fullname,
                pictureUrl: user.pictureUrl,
                phone: user.phone,
                address: user.address,
                role: user.role, 
                active: user.active,
                emp
                };
        }));
        res.status(200).json({ users: userEmpDetail });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
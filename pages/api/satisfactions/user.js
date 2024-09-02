import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
           const { userId } = req.query;
            try {
                const user = await Users.findOne({ userId });
                const emp = await Emp.findOne({ empId: user.empId });

                if (!emp) {
                    const userPopulated = {
                        ...user.toObject(),
                        emp: null,
                        teamGrop: null
                    }
                    return res.status(200).json({ success: true, data: userPopulated });
                } else {
                    const userPopulated = {
                        ...user.toObject(),
                        emp: emp.toObject(),
                        teamGrop: emp.teamGrop
                    }
    
                    res.status(200).json({ success: true, data: userPopulated });
                }

                
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
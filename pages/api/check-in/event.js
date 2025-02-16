import connetMongoDB from "@/lib/services/database/mongodb";
import EventCheckin from "@/database/models/Checkin/EventCheckin";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {  
                const checkin = await EventCheckin.findById(id);
                if (!checkin) {
                    return res.status(404).json({ success: false, message: "Event not found" });
                }

                const empIds = checkin.users.map(user => user.empId);
                const users = await Users.find({ empId: { $in: empIds } }).select('empId fullname pictureUrl userId phone');

                const updatedCheckin = {
                    ...checkin._doc,
                    users: users  // แทนที่ users ด้วยข้อมูลที่ดึงมา
                };

                res.status(200).json({ success: true, data: updatedCheckin });
                
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}

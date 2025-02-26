import connectMongoDB from "@/lib/services/database/mongodb";
import SentPointCoins from "@/database/models/SentPointCoins";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const { startDate, endDate } = req.query;

                let sent = [];

                if (!startDate || !endDate) {
                    const sentData = await SentPointCoins.find().lean();
                    
                    sent = sentData;
                } else {
                    // ดึงข้อมูล SentPointCoins
                    const sentData = await SentPointCoins.find({
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                    }).lean(); // ใช้ lean() เพื่อเพิ่มประสิทธิภาพ

                    sent = sentData;
                }

                if (!sent || sent.length === 0) {
                    return res.status(404).json({ success: false, error: "Data not found" });
                }

                const empIds = sent.map(s => s.trans); // ใช้ sent.trans เพราะมันเก็บ empId

                // ดึงข้อมูล Users
                const users = await Users.find({ empId: { $in: empIds } })
                    .select("empId fullname pictureUrl userId phone")
                    .lean();

                // ดึงข้อมูล Emp
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // สร้าง Map เพื่อการเข้าถึงข้อมูลเร็วขึ้น
                const userMap = users.reduce((map, user) => {
                    map[user.empId] = user;
                    return map;
                }, {});

                const empMap = emps.reduce((map, emp) => {
                    map[emp.empId] = emp;
                    return map;
                }, {});

                // รวมข้อมูลเข้าด้วยกัน
                const data = sent.map((s) => ({
                    ...s, // ใช้ `s` แทน `sent._doc` เพราะใช้ `lean()`
                    fullname: userMap[s.trans]?.fullname || "",
                    pictureUrl: userMap[s.trans]?.pictureUrl || "",
                    empId: userMap[s.trans]?.empId || "",
                    userId: userMap[s.trans]?.userId || "",
                    phone: userMap[s.trans]?.phone || "",
                    teamGroup: empMap[s.trans]?.teamGrop || "", // **แก้ teamGrop เป็น teamGroup**
                    position: empMap[s.trans]?.position || "",
                    department: empMap[s.trans]?.department || "",
                    branch: empMap[s.trans]?.branch || "",
                    group: empMap[s.trans]?.group || "",
                    chief_th: empMap[s.trans]?.chief_th || "",
                    chief_en: empMap[s.trans]?.chief_en || "",
                }));

                res.status(200).json({ success: true, data });

            } catch (error) {
                console.error("Error fetching SentPointCoins:", error);
                res.status(500).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, error: "Method not allowed" });
            break;
    }
}

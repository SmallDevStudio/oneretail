import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase"; // Firebase client SDK

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query; // ดึง userId จาก query string

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                // ดึงข้อมูลผู้ใช้ทั้งหมดจาก MongoDB
                const mongoUsers = await Users.find({});

                // ดึงข้อมูลสถานะออนไลน์จาก Firebase
                const snapshot = await get(ref(database, "users"));
                const users = [];

                // รวมข้อมูลจาก Firebase และ MongoDB
                mongoUsers.forEach((mongoUser) => {
                    const firebaseData = snapshot.val() ? snapshot.val()[mongoUser.userId] : null;
                    
                    if (mongoUser.userId !== userId) {  // ไม่แสดง userId ที่ตรงกับ userId จาก query
                        users.push({
                            userId: mongoUser.userId,
                            pictureUrl: mongoUser.pictureUrl,
                            fullname: mongoUser.fullname,
                            empId: mongoUser.empId || null,
                            online: firebaseData ? firebaseData.online : false,  // ถ้ามีข้อมูลจาก Firebase จะใช้ online ของ Firebase
                            lastSeen: firebaseData ? firebaseData.lastSeen : null, // ถ้ามีข้อมูลจาก Firebase จะใช้ lastSeen
                        });
                    }
                });

                // จัดเรียงผู้ใช้ตามสถานะออนไลน์ (online = true จะมาก่อน)
                const sortedUsers = users.sort((a, b) => b.online - a.online);

                // ส่งข้อมูลกลับไป
                res.status(200).json({ users: sortedUsers, length: sortedUsers.length });
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

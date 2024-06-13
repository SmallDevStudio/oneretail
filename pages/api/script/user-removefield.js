import connetMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";


export default async function handler(req, res) {
    const { method, body: { userId } } = req;

    switch (method) {
        case 'POST':
          try {
            // ดึงข้อมูลผู้ใช้
            const user = await Users.findOne({ userId });
    
            if (!user) {
              return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            // สร้าง object สำหรับ unset ฟิลด์ทั้งหมด
            const unsetFields = {};
            for (const field in user.toObject()) {
              if (field !== '_id' && field !== 'userId') {  // ยกเว้น _id และ userId
                unsetFields[field] = "";
              }
            }
    
            // อัปเดตผู้ใช้โดยการลบฟิลด์ทั้งหมด
            const result = await Users.updateOne(
              { userId },
              { $unset: unsetFields }
            );
    
            if (result.nModified === 0) {
              return res.status(404).json({ success: false, message: 'No fields were removed' });
            }
    
            res.status(200).json({ success: true, message: 'All fields removed successfully' });
          } catch (error) {
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, message: 'Method not allowed' });
          break;
      }
    }
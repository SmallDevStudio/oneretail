import connetMongoDB from "@/lib/services/database/mongodb";
import Point from "@/database/models/Point";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // 1. ดึง point เฉพาะ type: "earn"
        const points = await Point.find({ type: "earn" });

        // 2. รวมคะแนนตาม userId
        const userPoints = points.reduce((acc, point) => {
          const userId = point.userId.toString();
          if (!acc[userId]) {
            acc[userId] = { userId, totalPoints: 0 };
          }
          acc[userId].totalPoints += point.point;
          return acc;
        }, {});
        const userPointsArray = Object.values(userPoints);

        // 3. ดึงข้อมูล Users และ Emp
        const users = await Users.find({
          userId: { $in: userPointsArray.map((u) => u.userId) },
        })
          .select("userId fullname pictureUrl empId")
          .lean();

        const emps = await Emp.find({
          empId: { $in: users.map((u) => u.empId) },
        }).lean();

        // 4. รวมข้อมูลทั้งหมด
        const leaderboard = userPointsArray
          .map((up) => {
            const user = users.find((u) => u.userId === up.userId);
            const emp = emps.find((e) => e.empId === user?.empId);
            if (user && emp && /^RH[1-5]$/.test(emp.group)) {
              return {
                userId: user.userId,
                empId: user.empId,
                fullname: user.fullname,
                pictureUrl: user.pictureUrl,
                totalPoints: up.totalPoints,
                emp,
              };
            }
            return null;
          })
          .filter(Boolean);

        // 5. แยกตาม group และจัดเรียงในแต่ละกลุ่ม
        const grouped = {};

        leaderboard.forEach((entry) => {
          const group = entry.emp.group;
          if (!grouped[group]) {
            grouped[group] = [];
          }
          grouped[group].push(entry);
        });

        // 6. จัดเรียงคะแนนและใส่ rank ภายในแต่ละ group
        for (const group in grouped) {
          grouped[group].sort((a, b) => b.totalPoints - a.totalPoints);
          grouped[group].forEach((entry, index) => {
            entry.rank = index + 1;
          });
        }

        // 7. ส่งผลลัพธ์
        res.status(200).json({
          success: true,
          data: {
            group: grouped,
          },
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}

// /api/newleaderboard
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
        const { teamGrop } = req.query;

        // 1. ดึงเฉพาะ point.type = "earn"
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

        // 3. ดึงข้อมูล user และ emp
        const users = await Users.find({
          userId: { $in: userPointsArray.map((u) => u.userId) },
        })
          .select("userId fullname pictureUrl empId")
          .lean();

        const emps = await Emp.find({
          empId: { $in: users.map((u) => u.empId) },
        }).lean();

        // 4. รวมข้อมูลและกรอง teamGrop ถ้ามี
        const leaderboard = userPointsArray
          .map((up) => {
            const user = users.find((u) => u.userId === up.userId);
            const emp = emps.find((e) => e.empId === user?.empId);
            if (user && emp) {
              if (teamGrop && emp.teamGrop !== teamGrop) return null; // ถ้ามี teamGrop ให้กรอง
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
          .filter((item) => item !== null);

        // 5. จัดอันดับตามคะแนน
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
        leaderboard.forEach((entry, index) => (entry.rank = index + 1));

        // 6. หา top 1 ของแต่ละ group
        const groupTop = {};
        leaderboard.forEach((entry) => {
          const group = entry.emp?.group || "unknown";
          if (
            !groupTop[group] ||
            entry.totalPoints > groupTop[group].totalPoints
          ) {
            groupTop[group] = entry;
          }
        });

        // 7. จัดโครงสร้างข้อมูล
        const result = {
          rank: leaderboard,
          group: Object.entries(groupTop).reduce((acc, [group, user]) => {
            acc[group] = [user];
            return acc;
          }, {}),
        };

        res.status(200).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}

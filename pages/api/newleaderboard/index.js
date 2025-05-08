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
        // 1. Get point type: "earn"
        const points = await Point.find({ type: "earn" });

        // 2. Aggregate points per userId
        const userPointsMap = points.reduce((acc, point) => {
          const userId = point.userId.toString();
          if (!acc[userId]) acc[userId] = { userId, totalPoints: 0 };
          acc[userId].totalPoints += point.point;
          return acc;
        }, {});
        const userPointsArray = Object.values(userPointsMap);

        // 3. Get Users & Emps
        const users = await Users.find({
          userId: { $in: userPointsArray.map((u) => u.userId) },
        })
          .select("userId fullname pictureUrl empId")
          .lean();

        const emps = await Emp.find({
          empId: { $in: users.map((u) => u.empId) },
        }).lean();

        // 4. Merge all user + emp + point
        const enriched = userPointsArray
          .map((up) => {
            const user = users.find((u) => u.userId === up.userId);
            const emp = emps.find((e) => e.empId === user?.empId);
            if (user && emp) {
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

        // --- Group by RH1–RH5 and calculate group total & rank ---
        const rhGroups = {};
        enriched.forEach((entry) => {
          const group = entry.emp.group;
          if (/^RH[1-5]$/.test(group)) {
            if (!rhGroups[group]) rhGroups[group] = [];
            rhGroups[group].push(entry);
          }
        });

        const groupSummary = Object.entries(rhGroups)
          .map(([group, users]) => {
            const totalPoints = users.reduce(
              (sum, u) => sum + u.totalPoints,
              0
            );
            return {
              group,
              totalPoints,
              userCount: users.length,
            };
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((item, index) => ({ ...item, rank: index + 1 }));

        // --- Filter by group: only Retail or AL ---
        const filteredByGroup = enriched.filter(
          (entry) =>
            entry.emp.teamGrop === "Retail" || entry.emp.teamGrop === "AL"
        );

        // --- Group by Department ---
        const departmentMap = {};
        filteredByGroup.forEach((entry) => {
          const department = entry.emp.department || "Unknown";
          if (!departmentMap[department]) departmentMap[department] = [];
          departmentMap[department].push(entry);
        });

        const departmentSummary = Object.entries(departmentMap)
          .map(([department, users]) => {
            const totalPoints = users.reduce(
              (sum, u) => sum + u.totalPoints,
              0
            );
            const sortedUsers = [...users]
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((user, index) => ({ ...user, rank: index + 1 }));

            return {
              department,
              totalPoints,
              users: sortedUsers,
            };
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((b, index) => ({ ...b, rank: index + 1 }));

        res.status(200).json({
          success: true,
          data: {
            groupByRH: groupSummary,
            departmentSummary,
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

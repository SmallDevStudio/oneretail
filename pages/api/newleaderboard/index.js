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
          (entry) => entry.emp.teamGrop === "Retail"
        );

        // --- Group by Department ---
        // Department whitelist map for merging and group labeling
        const whitelistMap = {
          จตุจักร: { names: ["จตุจักร", "สาขาสำนักพหลโยธิน"], group: "RH1" },
          ธนบุรี: { names: ["ธนบุรี"], group: "RH1" },
          บางกะปิ: { names: ["บางกะปิ"], group: "RH1" },
          สาทร: { names: ["สาทร"], group: "RH1" },
          สุขุมวิท: { names: ["สุขุมวิท"], group: "RH1" },

          ชลบุรี: { names: ["ชลบุรี"], group: "RH2" },
          บางนา: { names: ["บางนา"], group: "RH2" },
          พัทยา: { names: ["พัทยา"], group: "RH2" },
          ระยอง: { names: ["ระยอง"], group: "RH2" },

          เชียงใหม่: { names: ["เชียงใหม่"], group: "RH3" },
          นครสวรรค์: { names: ["นครสวรรค์"], group: "RH3" },
          นนทบุรี: { names: ["นนทบุรี"], group: "RH3" },
          พิษณุโลก: { names: ["พิษณุโลก"], group: "RH3" },
          อยุธยา: { names: ["อยุธยา"], group: "RH3" },

          ดอนเมือง: { names: ["ดอนเมือง"], group: "RH4" },
          นครราชสีมา: { names: ["นครราชสีมา"], group: "RH4" },
          สระบุรี: { names: ["สระบุรี"], group: "RH4" },
          อุดรธานี: { names: ["อุดรธานี"], group: "RH4" },
          อุบลราชธานี: { names: ["อุบลราชธานี"], group: "RH4" },

          ภูเก็ต: { names: ["ภูเก็ต"], group: "RH5" },
          ราชบุรี: { names: ["ราชบุรี"], group: "RH5" },
          สมุทรสาคร: { names: ["สมุทรสาคร"], group: "RH5" },
          สุราษฎร์ธานี: { names: ["สุราษฎร์ธานี"], group: "RH5" },
          หาดใหญ่: { names: ["หาดใหญ่"], group: "RH5" },
        };

        // Merge departments
        const mergedDepartmentMap = {};
        filteredByGroup.forEach((entry) => {
          const deptShort = entry.emp.departmentshort;
          const displayName = Object.keys(whitelistMap).find((key) =>
            whitelistMap[key].names.includes(deptShort)
          );

          if (!displayName) return; // skip if not in whitelist

          if (!mergedDepartmentMap[displayName]) {
            mergedDepartmentMap[displayName] = {
              department: displayName,
              group: whitelistMap[displayName].group,
              users: [],
              totalPoints: 0,
            };
          }

          mergedDepartmentMap[displayName].users.push(entry);
          mergedDepartmentMap[displayName].totalPoints += entry.totalPoints;
        });

        // Convert to array and sort
        const departmentSummary = Object.values(mergedDepartmentMap)
          .map((dept) => {
            const sortedUsers = [...dept.users]
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((u, index) => ({ ...u, rank: index + 1 }));
            return {
              ...dept,
              users: sortedUsers,
            };
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((dept, index) => ({ ...dept, rank: index + 1 }));

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

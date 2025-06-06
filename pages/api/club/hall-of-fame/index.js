import connetMongoDB from "@/lib/services/database/mongodb";
import HallOfFame from "@/database/models/Hall-of-fame/Hall-of-fame";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;
  await connetMongoDB();

  switch (method) {
    case "GET":
      const rawMonth = req.query.month;
      const rawYear = req.query.year;
      const rawType = req.query.type;

      const query = {};

      if (rawType && rawType.trim() !== "") {
        query.rewardtype = { $regex: new RegExp(`^${rawType.trim()}$`, "i") };
      }

      const monthNum = parseInt(rawMonth);
      if (!isNaN(monthNum)) {
        query.month = monthNum;
      }

      const yearNum = parseInt(rawYear);
      if (!isNaN(yearNum)) {
        query.year = yearNum;
      }

      try {
        const records = await HallOfFame.find(query);

        if (!records || records.length === 0) {
          return res.status(200).json({
            rewardtype: rawType ? rawType : null,
            month: !isNaN(monthNum) ? monthNum : null,
            year: !isNaN(yearNum) ? yearNum : null,
            data: {},
          });
        }

        // รวม empId ทั้งหมด
        const empIds = records.map((r) => r.empId);
        const [emps, users] = await Promise.all([
          Emp.find({ empId: { $in: empIds } }),
          Users.find({ empId: { $in: empIds } }),
        ]);

        const empMap = {};
        const userMap = {};

        for (const emp of emps) {
          empMap[emp.empId] = emp;
        }
        for (const user of users) {
          userMap[user.empId] = user;
        }

        const grouped = {};
        for (const item of records) {
          const enrichedItem = {
            ...item.toObject(),
            emp: empMap[item.empId] || null,
            user: userMap[item.empId] || null,
          };

          if (!grouped[item.position]) {
            grouped[item.position] = [];
          }

          grouped[item.position].push(enrichedItem);
        }

        // Sort by achieve มากไปน้อยในแต่ละตำแหน่ง และเพิ่ม rank
        for (const position in grouped) {
          grouped[position].sort((a, b) => b.achieve - a.achieve);
          grouped[position] = grouped[position].map((item, index) => ({
            ...item,
            rank: index + 1,
          }));
        }

        const bbdOrder = [
          "BM",
          "CLSM",
          "CLSA",
          "CISA",
          "CFSA",
          "WCRM",
          "PBCRM",
          "EWS",
          "MDS",
          "MAL",
          "CISAL",
          "CFSA_YINDEE",
        ];
        const alOrder = ["AL GH", "NC MKT", "UC MKT"];

        const orderedGrouped = {};

        if (bbdOrder.some((pos) => grouped[pos])) {
          orderedGrouped["BBD"] = {};
          for (const pos of bbdOrder) {
            if (grouped[pos]) {
              orderedGrouped["BBD"][pos] = grouped[pos];
            }
          }
        }

        if (alOrder.some((pos) => grouped[pos])) {
          orderedGrouped["AL"] = {};
          for (const pos of alOrder) {
            if (grouped[pos]) {
              orderedGrouped["AL"][pos] = grouped[pos];
            }
          }
        }

        return res.status(200).json({
          rewardtype: rawType ? rawType : null,
          month: !isNaN(monthNum) ? monthNum : null,
          year: !isNaN(yearNum) ? yearNum : null,
          data: orderedGrouped,
        });
      } catch (err) {
        console.error("Error fetching HallOfFame:", err);
        return res.status(500).json({ message: "Server error" });
      }

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}

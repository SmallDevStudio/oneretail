import connectMongoDB from "@/lib/services/database/mongodb";
import UserActivity from "@/database/models/UserActivity";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import dayjs from "dayjs";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { method, query } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const { startDate, endDate } = query;

        const start = startDate
          ? dayjs(startDate).startOf("day")
          : dayjs().subtract(7, "days").startOf("day");
        const end = endDate
          ? dayjs(endDate).endOf("day")
          : dayjs().endOf("day");

        // 1. ดึงข้อมูลเรียงตามเวลาเก่า → ใหม่
        const activities = await UserActivity.find({
          createdAt: { $gte: start.toDate(), $lte: end.toDate() },
        }).sort({ createdAt: 1 });

        // 2. เก็บแค่ record แรกของแต่ละ user ต่อวัน
        const groupedActivities = {};
        activities.forEach((act) => {
          const day = dayjs(act.createdAt).format("YYYY-MM-DD");
          const key = `${act.userId}-${day}`;
          if (!groupedActivities[key]) {
            groupedActivities[key] = act;
          }
        });

        const limitedActivities = Object.values(groupedActivities);

        // 3. ดึงข้อมูล Users
        const userIds = limitedActivities.map((act) => act.userId);
        const users = await Users.find({ userId: { $in: userIds } }).select(
          "userId fullname empId"
        );
        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        // 4. ดึงข้อมูล Emp
        const empIds = users.map((user) => user.empId);
        const emps = await Emp.find({ empId: { $in: empIds } });
        const empMap = emps.reduce((acc, emp) => {
          acc[emp.empId] = emp;
          return acc;
        }, {});

        // 5. รวมข้อมูล UserActivity + Users + Emp
        const result = limitedActivities.map((act) => ({
          ...act._doc,
          user: userMap[act.userId] || null,
          emp: userMap[act.userId] ? empMap[userMap[act.userId].empId] : null,
        }));

        // 6. เรียงใหม่ → เก่า
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

import connetMongoDB from "@/lib/services/database/mongodb";
import News1 from "@/database/models/News/News1";
import NewComments from "@/database/models/News/NewComments";
import NewGroups from "@/database/models/News/NewGroups";
import NewTabs from "@/database/models/News/NewTabs";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        // 1. ดึงข้อมูลทั้งหมด
        const [news, groups, tabs] = await Promise.all([
          News1.find({ active: true, deleted: false }).sort({ createdAt: -1 }),
          NewGroups.find({}),
          NewTabs.find({}),
        ]);

        // 2. ดึง comment count ตามข่าว
        const commentCounts = await NewComments.aggregate([
          {
            $group: {
              _id: "$newsId",
              count: { $sum: 1 },
            },
          },
        ]);

        const commentCountMap = Object.fromEntries(
          commentCounts.map((c) => [c._id.toString(), c.count])
        );

        // 3. สร้าง Map สำหรับ group/tab lookup
        const groupMap = Object.fromEntries(
          groups.map((g) => [g.value, g.name])
        );
        const tabMap = Object.fromEntries(tabs.map((t) => [t.value, t.name]));

        // 4. สร้างผลลัพธ์
        const result = {};

        for (const item of news) {
          const tabValue = item.tab;
          const groupValue = item.group;

          const tabName = tabMap[tabValue] || tabValue || "ไม่ระบุแท็บ";
          const groupName =
            groupMap[groupValue] || groupValue || "ไม่ระบุกลุ่ม";

          if (!result[tabValue]) {
            result[tabValue] = [];
          }

          let groupEntry = result[tabValue].find((entry) => entry[groupName]);
          if (!groupEntry) {
            groupEntry = { [groupName]: [] };
            result[tabValue].push(groupEntry);
          }

          const commentCount = commentCountMap[item._id.toString()] || 0;
          const likeCount = item.likes?.length || 0;

          groupEntry[groupName].push({
            ...item._doc,
            commentCount,
            likeCount,
          });
        }

        res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error("Error fetching News:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const news = await News1.create(req.body);
        res.status(201).json(news);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}

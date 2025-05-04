// /api/libraries/views.js
import connectMongoDB from "@/lib/services/database/mongodb";
import LibraryView from "@/database/models/LibraryView";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  await connectMongoDB();
  const { publicId } = req.query;
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // 1. Find library view
        const libraryView = await LibraryView.findOne({ public_id: publicId });
        if (!libraryView) {
          return res.status(200).json({
            success: true,
            data: { views: 0, user: [] },
          });
        }

        const userIds = libraryView.user.map((u) => u.userId);

        // 2. Get users by userIds
        const users = await Users.find({ userId: { $in: userIds } });

        // 3. Get emp by empId from users
        const empIds = users.map((u) => u.empId).filter(Boolean);
        const emps = await Emp.find({ empId: { $in: empIds } });

        // 4. Map user + emp info into view user list
        const userMap = users.reduce((acc, u) => {
          acc[u.userId] = u;
          return acc;
        }, {});

        const empMap = emps.reduce((acc, e) => {
          acc[e.empId] = e;
          return acc;
        }, {});

        const enrichedUser = libraryView.user.map((view) => {
          const user = userMap[view.userId];
          const emp = empMap[user?.empId];
          return {
            ...view.toObject(),
            user: user || null,
            emp: emp || null,
          };
        });

        return res.status(200).json({
          success: true,
          data: {
            ...libraryView.toObject(),
            user: enrichedUser,
          },
        });
      } catch (error) {
        console.error("Error in GET /api/libraries/views:", error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
  }
}

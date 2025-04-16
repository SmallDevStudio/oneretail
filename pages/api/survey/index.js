import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import Coins from "@/database/models/Coins";
import sendLineMessage from "@/lib/sendLineMessage";
import moment from "moment-timezone";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const { startDate, endDate, page = 1, pageSize = 100 } = req.query;
        const query = {};

        if (startDate && endDate) {
          query.createdAt = {
            $gte: moment(startDate).startOf("day").toDate(),
            $lte: moment(endDate).endOf("day").toDate(),
          };
        }

        const surveys = await Survey.find(query)
          .skip((page - 1) * pageSize)
          .limit(Number(pageSize))
          .lean();

        const userIds = surveys.map((survey) => survey.userId);
        const users = await Users.find({ userId: { $in: userIds } })
          .select("userId fullname empId pictureUrl")
          .lean();

        const empIds = users.map((user) => user.empId);
        const emps = await Emp.find({ empId: { $in: empIds } }).lean();
        const empMap = emps.reduce((acc, emp) => {
          acc[emp.empId] = emp;
          return acc;
        }, {});

        const surveysWithUserDetails = surveys.map((survey) => {
          const user = users.find((user) => user.userId === survey.userId);
          const emp = user ? empMap[user.empId] : null;
          return {
            ...survey,
            fullname: user ? user.fullname : "Unknown",
            pictureUrl: user ? user.pictureUrl : "",
            empId: user ? user.empId : "Unknown",
            emp: emp || {},
          };
        });

        res.status(200).json(surveysWithUserDetails);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const survey = await Survey.create(req.body);

        const newCoins = new Coins({
          userId: survey.userId,
          description: `ส่งแบบสอบถาม ${new Date().toISOString().split("T")[0]}`,
          referId: survey._id,
          path: "survey",
          type: "earn",
          coins: 1,
        });
        await newCoins.save();

        const message = `คุณได้รับ Coins 1 จากการส่งแบบสอบถามแล้ว!`;
        await sendLineMessage(survey.userId, message);

        res.status(201).json({ success: true, data: survey });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: "Method not allowed" });
      break;
  }
}

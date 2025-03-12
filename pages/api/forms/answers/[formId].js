import connectMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";
import UseForms from "@/database/models/UseForms";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;
  const { formId } = req.query;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const answers = await UseForms.find({ formId }).lean();
        if (!answers.length) {
          return res
            .status(200)
            .json({ success: true, message: "Answers not found" });
        }

        const form = await Forms.findById(formId);
        if (!form) {
          return res
            .status(404)
            .json({ success: false, message: "Form not found" });
        }

        const userIds = answers.map((answer) => answer.userId);
        const users = await Users.find({ userId: { $in: userIds } })
          .select("userId fullname pictureUrl role empId")
          .lean();

        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        // ดึง empId ที่ไม่ใช่ undefined
        const empIds = users.map((user) => user.empId).filter((empId) => empId);
        const emps = await Emp.find({ empId: { $in: empIds } }).lean();

        const empMap = emps.reduce((acc, emp) => {
          acc[emp.empId] = emp;
          return acc;
        }, {});

        const populatedAnswers = answers.map((answer) => {
          const user = userMap[answer.userId] || null;
          const emp = user?.empId ? empMap[user.empId] : null;
          return {
            ...answer,
            user,
            emp,
          };
        });

        const populatedForm = {
          ...form.toObject(),
          answers: populatedAnswers,
        };

        res.status(200).json({ success: true, data: populatedForm });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

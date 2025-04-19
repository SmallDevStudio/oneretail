import connetMongoDB from "@/lib/services/database/mongodb";
import Ebooks from "@/database/models/Ebooks/Ebooks";
import UseEbook from "@/database/models/Ebooks/UseEbook";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
  const { method } = req;

  await connetMongoDB();

  switch (method) {
    case "GET":
      try {
        const ebooks = await Ebooks.find();

        const useEbooks = await UseEbook.find();
        const allUsers = await Users.find().select(
          "userId empId fullname pictureUrl"
        );
        const allEmps = await Emp.find();

        const userMap = allUsers.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        const empMap = allEmps.reduce((acc, emp) => {
          acc[emp.empId] = emp;
          return acc;
        }, {});

        const enriched = ebooks.map((ebook) => {
          const relatedUse = useEbooks.filter(
            (u) => u.ebookId?.toString() === ebook._id.toString()
          );

          const mappedUse = relatedUse.map((u) => {
            const user = userMap[u.userId] || {};
            const emp = empMap[user.empId] || {};

            return {
              ...(user.toObject?.() || user),
              ...(emp.toObject?.() || emp),
              createdAt: u.createdAt, // ✅ เพิ่มตรงนี้
            };
          });

          return {
            ...ebook.toObject(),
            count: relatedUse.length,
            useEbook: mappedUse,
          };
        });

        res.status(200).json({ success: true, data: enriched });
      } catch (error) {
        console.error("GET /api/ebook error:", error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const ebook = await Ebooks.create(req.body);
        res.status(201).json({ success: true, data: ebook });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

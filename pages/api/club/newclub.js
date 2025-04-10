import connectMongoDB from "@/lib/services/database/mongodb";
import NewClub from "@/database/models/Club/NewClub";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const allClubs = await NewClub.find({}).lean();

        // Group by cleaned position
        const grouped = allClubs.reduce((acc, club) => {
          const rawPos = club.position || "Unknown";
          const cleanedPos = rawPos.trim(); // ✅ Remove extra whitespace
          if (!acc[cleanedPos]) acc[cleanedPos] = [];
          acc[cleanedPos].push(club);
          return acc;
        }, {});

        // Sort each group by rank ascending
        Object.keys(grouped).forEach((pos) => {
          grouped[pos].sort((a, b) => a.rank - b.rank);
        });

        res.status(200).json({ success: true, data: grouped });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
}

import connectMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
  const { method } = req;
  const { fileId } = req.query;

  await connectMongoDB();

  switch (method) {
    case "DELETE": {
      try {
        const deletedLibrary = await Library.findByIdAndDelete(fileId);

        if (!deletedLibrary) {
          return res
            .status(404)
            .json({ success: false, message: "ไม่พบข้อมูลที่ต้องการลบ" });
        }

        return res.status(200).json({ success: true, data: deletedLibrary });
      } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    default:
      res.setHeader("Allow", ["DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

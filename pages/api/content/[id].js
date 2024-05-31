import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
   if (req.method === "DELETE") {
     const { id } = req.query;
     await connetMongoDB();
     const deletedContent = await Content.findByIdAndDelete(id);
     res.status(200).json(deletedContent);
   }
}
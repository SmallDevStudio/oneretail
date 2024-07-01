import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    try {
      const result = await Content.updateMany({}, { views: 0 });
      res.status(200).json({ success: true, message: `${result.nModified} records updated` });
    } catch (error) {
      console.error('Error updating views:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

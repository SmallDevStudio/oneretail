import connetMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";
import Content from "@/database/models/Content";


export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
      case 'DELETE':
        try {
          const comment = await ContentComment.findByIdAndDelete(id);
          if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
          }
          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
        break;
        default:
          res.status(400).json({ success: false, error: 'Invalid request method' });
          break;
      }
    }
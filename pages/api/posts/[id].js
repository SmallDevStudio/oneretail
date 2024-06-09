import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case 'PUT':
          try {
            const post = await Post.findByIdAndUpdate(id, req.body, {
              new: true,
              runValidators: true,
            });
            if (!post) {
              return res.status(400).json({ success: false });
            }
            res.status(200).json({ success: true, data: post });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'DELETE':
          try {
            const deletedPost = await Post.deleteOne({ _id: id });
            if (!deletedPost) {
              return res.status(400).json({ success: false });
            }
            res.status(200).json({ success: true, data: {} });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        default:
          res.status(400).json({ success: false });
          break;
      }
    }

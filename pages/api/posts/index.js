import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            const posts = await Post.find({})
              .populate('user')
              .populate({
                path: 'comments',
                populate: { path: 'user' },
              });
            res.status(200).json({ success: true, data: posts });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
          case 'POST':
            try {
              const post = await Post.create(req.body);
              res.status(201).json({ success: true, data: post });
            } catch (error) {
              console.error('Error creating post:', error);
              res.status(400).json({ success: false, error: error.message });
            }
            break;
          default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
        }
    }
    
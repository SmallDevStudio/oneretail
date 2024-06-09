import connetMongoDB from "@/lib/services/database/mongodb";
import Comment from "@/database/models/Comment";
import Post from "@/database/models/Post";

export default async function handler(req, res) {
    const { method } = req
    const { id } = req.query

    switch (method) {
        case 'DELETE':
          try {
            const comment = await Comment.findById(id);
            if (!comment) {
              return res.status(404).json({ success: false, error: 'Comment not found' });
            }
    
            // Remove the comment from the post
            await Post.findByIdAndUpdate(comment.post, { $pull: { comments: id } });
    
            await comment.remove();
            res.status(200).json({ success: true });
          } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: 'Invalid request method' });
          break;
      }
    }

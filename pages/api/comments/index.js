import connetMongoDB from "@/lib/services/database/mongodb";
import Comment from "@/database/models/Comment";
import Post from "@/database/models/Post";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'POST':
          try {
            const { content, user, postId } = req.body;
            const comment = await Comment.create({ content, user, post: postId });
    
            // Update the post to include the new comment
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    
            res.status(201).json({ success: true, data: comment });
          } catch (error) {
            console.error('Error creating comment:', error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: 'Invalid request method' });
          break;
      }
    }
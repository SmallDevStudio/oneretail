import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method, query } = req;
    const { id } = query;

    switch (method) {
      case 'GET':
      try {
        let content = await Content.findById(id)
          .populate('categories')
          .populate('subcategories')
          .populate('groups')
          .lean();

        if (!content) {
          return res.status(404).json({ success: false, error: 'Content not found' });
        }

        const user = await Users.findOne({ userId: content.author }).select('userId fullname pictureUrl role');
        content.author = user || null;

        const comments = await ContentComment.find({ contentId: id });
        const userIds = comments.map(comment => comment.user);
        const commentUsers = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
        const userMap = commentUsers.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});

        content.comments = comments.map(comment => {
          comment = comment.toObject();
          comment.user = userMap[comment.user] || null;
          return comment;
        });

        res.status(200).json({ success: true, data: content });
      } catch (error) {
        console.error('Error fetching content:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

      case 'PUT':
        try {
          const { userId } = req.body;
          const content = await Content.findById(id);
  
          if (!content) {
            return res.status(404).json({ success: false, error: 'Content not found' });
          }
  
          // Ensure content.likes is an array
          if (!Array.isArray(content.likes)) {
            content.likes = [];
          }
  
          const userHasLiked = content.likes.includes(userId);
  
          if (userHasLiked) {
            // Remove like
            content.likes = content.likes.filter(like => like !== userId);
          } else {
            // Add like
            content.likes.push(userId);
          }
  
          await content.save();
  
          res.status(200).json({ success: true, data: content });
        } catch (error) {
          console.error('Error updating content:', error);
          res.status(400).json({ success: false, error: error.message });
        }
        break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
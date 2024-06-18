import connetMongoDB from "@/lib/services/database/mongodb";
import ContentComment from "@/database/models/ContentComment";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import mongoose from "mongoose";


export default async function handler(req, res) {
    await connetMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
          // Get all comments
          const { contentId } = req.query;
          let contentObjectId;
          try {
            contentObjectId = new mongoose.Types.ObjectId(contentId);
          } catch (err) {
            return res.status(400).json({ success: false, error: 'Invalid content ID format' });
          }
          const comments = await ContentComment.find({ contentId: contentObjectId });
          if (comments.length === 0) {
            return res.status(200).json({ success: true, data: [] });
          }

          const user = comments.map(comment => comment.user);
          const users = await Users.find({ userId: { $in: user } });
          const userMap = users.reduce((acc, user) => {
            acc[user.userId] = user;
            return acc;
          }, {});

          const populatedComments = comments.map(comment => {
            comment = comment.toObject();
            comment.user = userMap[comment.user] || null;
            return comment;
          });
          res.status(200).json({ success: true, data: populatedComments });
          break;

        case 'POST':
          try {
            const { content, user, contentId } = req.body;
            const comment = await ContentComment.create({ content, user, contentId });
    
            // Optionally update the content to include the new comment
            await Content.findByIdAndUpdate(contentId, { $push: { comments: comment._id } });
    
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
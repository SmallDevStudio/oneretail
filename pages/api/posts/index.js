import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Point from "@/database/models/Point";
import sendLineMessage from "@/lib/sendLineMessage";

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
              console.log(post);

              // Find the user who created the post
              const user = await Users.findById(req.body.user);

              if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
              }

              // Add 20 points to the user's account
                const newPoint = new Point({
                  userId: user.userId,
                  description: 'Received points for creating a post',
                  type: 'earn',
                  contentId: null,
                  point: 20,
                });
                await newPoint.save();

                // Send a LINE message to the user
                await sendLineMessage(user.userId, 'คุณได้รับ 20 points จากการสร้าง Share Your Story!');


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
    
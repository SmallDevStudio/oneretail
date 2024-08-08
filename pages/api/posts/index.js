import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            const posts = await Post.find().sort({ createdAt: -1 });
            const userIds = posts.map(posts => posts.userId);
                const users = await Users.find({ userId: { $in: userIds } });
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedPost = await Promise.all(
                  posts.map(async (post) => {
                      const comments = await Comment.find({ postId: post._id });
                      const commentUserIds = comments.map(comment => comment.userId);
                      const commentUsers = await Users.find({ userId: { $in: commentUserIds } });
                      const commentUserMap = commentUsers.reduce((acc, user) => {
                          acc[user.userId] = user;
                          return acc;
                      }, {});

                      const populatedComments = await Promise.all(comments.map(async (comment) => {
                          // ดึง replies ของ comment นี้
                          const replies = await Reply.find({ commentId: comment._id });
                          const replyUserIds = replies.map(reply => reply.userId);
                          const replyUsers = await Users.find({ userId: { $in: replyUserIds } });
                          const replyUserMap = replyUsers.reduce((acc, user) => {
                              acc[user.userId] = user;
                              return acc;
                          }, {});

                          // รวมข้อมูล user กับ replies
                          const populatedReplies = replies.map(reply => ({
                              ...reply._doc,
                              user: replyUserMap[reply.userId]
                          }));

                          return {
                              ...comment._doc,
                              user: commentUserMap[comment.userId],
                              reply: populatedReplies // รวม replies
                          };
                      }));

                      return {
                          ...post._doc,
                          user: userMap[post.userId],
                          comments: populatedComments
                      };
                  })
              );

            res.status(200).json({ success: true, data: populatedPost });
          } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(400).json({ success: false, error: error.message });
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

            case 'DELETE':
            const { postId } = req.query;
            try {
                const post = await Post.findById(postId);

                if (!post) {
                    return res.status(404).json({ success: false, error: "Post not found" });
                }

                // Find and delete all comments related to the post
                const comments = await Comment.find({ postId });
                const commentIds = comments.map(comment => comment._id);

                // Delete all replies related to the comments
                await Reply.deleteMany({ commentId: { $in: commentIds } });

                // Delete all comments related to the post
                await Comment.deleteMany({ postId });

                // Delete the post itself
                await Post.findByIdAndDelete(postId);

                res.status(200).json({ success: true, data: post });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
        }
    }
    
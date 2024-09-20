import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";
import Library from "@/database/models/Library";
import LibraryDelete from "@/database/models/LibraryDelete";
import { del } from '@vercel/blob';

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            const posts = await Post.find().sort({ pinned: -1, createdAt: -1 });
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
                case 'DELETE':
                    const { postId, userId } = req.query;
        
                    try {
                        // ดึงโพสต์ที่กำลังจะลบ
                        const post = await Post.findById(postId);
        
                        if (!post) {
                            return res.status(404).json({ success: false, error: "Post not found" });
                        }
        
                        // ดึง public_id และ url จาก media ของโพสต์
                        const mediaToDelete = post.media.map(item => ({
                            public_id: item.public_id,
                            url: item.url,
                            file_name: item.file_name,
                            type: item.type
                        }));
        
                        // ลบไฟล์จาก Vercel Blob
                        const deletePromises = mediaToDelete.map(async (media) => {
                            try {
                                await del(media.url, {
                                    onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
                                        const token = process.env.OneRetail_READ_WRITE_TOKEN; // ใช้ Environment Variable
                                        if (!token) throw new Error('Missing Vercel Blob token');
        
                                        return {
                                            tokenPayload: JSON.stringify({ token }),
                                        };
                                    },
                                });
                            } catch (error) {
                                console.error(`Error deleting blob for URL ${media.url}:`, error);
                            }
                        });
                        await Promise.all(deletePromises); // รอให้ลบไฟล์ทั้งหมดเสร็จสิ้น
        
                        // ลบข้อมูลใน Library ที่มี public_id ตรงกับโพสต์
                        await Library.deleteMany({ public_id: { $in: mediaToDelete.map(media => media.public_id) } });
        
                        // บันทึกข้อมูลการลบลงใน LibraryDelete
                        const libraryDelete = new LibraryDelete({
                            delete: [{
                                contentId: postId,
                                media: mediaToDelete
                            }],
                            userId: userId // ใช้ userId ของผู้ลบโพสต์
                        });
        
                        await libraryDelete.save(); // บันทึกข้อมูลการลบ
        
                        // ลบโพสต์เอง
                        await Post.findByIdAndDelete(postId);
        
                        // ลบความคิดเห็นและการตอบกลับที่เกี่ยวข้อง
                        const comments = await Comment.find({ postId });
                        const commentIds = comments.map(comment => comment._id);
                        await Reply.deleteMany({ commentId: { $in: commentIds } });
                        await Comment.deleteMany({ postId });
        
                        res.status(200).json({ success: true, message: 'Post and related media deleted successfully' });
        
                    } catch (error) {
                        console.error('Error during deletion:', error);
                        res.status(500).json({ success: false, error: error.message });
                    }
                    break;
        

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
        }
    }
    
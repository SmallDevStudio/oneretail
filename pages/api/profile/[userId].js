import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import Level from "@/database/models/Level";
import Point from "@/database/models/Point";
import Coins from "@/database/models/Coins";
import Post from "@/database/models/Post";
import Comment from "@/database/models/Comment";
import Reply from "@/database/models/Reply";

export default async function handler(req, res) {
  const { userId } = req.query;
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        // 1. ดึงข้อมูลผู้ใช้และข้อมูลพนักงาน
        const user = await Users.findOne({ userId });
        if (!user) throw new Error("User not found");
        const emp = await Emp.findOne({ empId: user.empId });

        // 2. คำนวณคะแนน (Points)
        const points = await Point.find({ userId });
        const pointData = points.reduce(
          (acc, point) => {
            if (point.type === "earn") {
              acc.totalPoints += point.point;
              acc.point += point.point;
            } else if (point.type === "pay") {
              acc.point -= point.point;
            }
            return acc;
          },
          { point: 0, totalPoints: 0 }
        );

        // 3. คำนวณระดับของผู้ใช้ (Level)
        const levels = await Level.find().sort({ level: 1 });
        let userLevel = 1;
        let requiredPoints = 0;
        let nextLevelRequiredPoints = 0;
        for (const level of levels) {
          if (pointData.totalPoints >= level.requiredPoints) {
            userLevel = level.level;
            requiredPoints = level.requiredPoints;
          } else {
            nextLevelRequiredPoints = level.requiredPoints;
            break;
          }
        }
        const levelPoint = pointData.totalPoints - requiredPoints;
        const levelData = {
          level: userLevel,
          requiredPoints,
          nextLevelRequiredPoints,
          levelPoint,
        };
        const pointResult = {
          point: pointData.point,
          totalPoints: pointData.totalPoints,
        };

        // 4. คำนวณเหรียญ (Coins)
        const coins = await Coins.find({ userId });
        const totalEarn = coins
          .filter((coin) => coin.type === "earn")
          .reduce((sum, coin) => sum + coin.coins, 0);
        const totalPay = coins
          .filter((coin) => coin.type === "pay")
          .reduce((sum, coin) => sum + coin.coins, 0);
        const coinsData = {
          totalCoins: totalEarn,
          coins: totalEarn - totalPay,
        };

        // 5. ดึงโพสใน 2 ส่วน
        // ส่วนที่ 1: โพสที่สร้างโดย user
        const postsCreated = await Post.find({ userId }).lean();

        // ส่วนที่ 2: โพสที่มี tag userId (จากคนอื่น) โดยมี status เป็น 'published' หรือ 'friend'
        const postsTagged = await Post.find({
          "tagusers.userId": userId,
          status: { $in: ["published", "friend"] },
        }).lean();

        // 6. รวมโพสทั้ง 2 ส่วนเข้าด้วยกัน (ถ้ามีโพสที่ซ้ำกันจะ deduplicate โดยใช้ _id)
        const combinedPostsMap = new Map();
        postsCreated.forEach((post) => {
          combinedPostsMap.set(post._id.toString(), post);
        });
        postsTagged.forEach((post) => {
          combinedPostsMap.set(post._id.toString(), post);
        });
        let combinedPosts = Array.from(combinedPostsMap.values());

        // 7. sort โพสโดย createdAt (เรียงจากใหม่ไปเก่า)
        combinedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 8. Process แต่ละโพสเพื่อเพิ่มข้อมูล user, tagUsers, comments & replies
        const populatedPosts = await Promise.all(
          combinedPosts.map(async (post) => {
            // ดึงข้อมูลผู้โพส
            const postUser = await Users.findOne({ userId: post.userId });

            // ดึงข้อมูล tagusers แบบ manual (ถ้ามี)
            let taggedUsers = [];
            if (post.tagusers && post.tagusers.length > 0) {
              taggedUsers = await Promise.all(
                post.tagusers.map(async (tag) => {
                  return await Users.findOne({ userId: tag.userId });
                })
              );
            }

            // ดึง comments ของโพส
            const comments = await Comment.find({ postId: post._id });
            const populatedComments = await Promise.all(
              comments.map(async (comment) => {
                const commentUser = await Users.findOne({ userId: comment.userId });
                const replies = await Reply.find({ commentId: comment._id });
                const populatedReplies = await Promise.all(
                  replies.map(async (reply) => ({
                    ...reply._doc,
                    user: await Users.findOne({ userId: reply.userId }),
                  }))
                );
                return {
                  ...comment._doc,
                  user: commentUser,
                  replies: populatedReplies,
                };
              })
            );

            return {
              ...post,
              user: postUser,
              tagUsers: taggedUsers,
              comments: populatedComments,
            };
          })
        );

        // 9. วนลูปผ่านโพสทั้งหมดเพื่อดึงข้อมูล medias ของแต่ละโพส
        const images = [];
        const videos = [];

        populatedPosts.forEach((post) => {
          if (post.medias && post.medias.length > 0) {
            post.medias.forEach((media) => {
              if (media.type === "image") {
                images.push({
                  public_id: media.public_id,
                  type: media.type,
                  url: media.url,
                  _id: media._id, // ใช้ _id ของ media (หรืออาจจะเอา _id ของโพสถ้าต้องการ)
                });
              } else if (media.type === "video") {
                videos.push({
                  public_id: media.public_id,
                  type: media.type,
                  url: media.url,
                  _id: media._id,
                });
              }
            });
          }
        });

        // 10. ส่งกลับข้อมูลรวม
        res.status(200).json({
          success: true,
          data: {
            user,               // ข้อมูลผู้ใช้
            emp,                // ข้อมูลพนักงาน
            level: levelData,   // ข้อมูลระดับของผู้ใช้
            points: pointResult, // คะแนน
            coins: coinsData,    // เหรียญ
            posts: populatedPosts, // โพสทั้งหมด (ทั้งที่สร้างเองและที่มี tag user)
            images: images,             // รูปทั้งหมดที่ดึงมาจากทุกโพส
            video: videos,      // วิดีโอทั้งหมดที่ดึงมาจากทุกโพส
          },
        });
      } catch (error) {
        console.error("Error in GET handler:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}

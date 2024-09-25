import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import LibraryView from "@/database/models/LibraryView";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 });
                if (posts.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                }

                const userIds = posts.map(post => post.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname empId');

                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const userMap = users.reduce((acc, user) => {
                    const empData = empMap[user.empId];
                    acc[user.userId] = {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: empData?.teamGrop || 'Unknown',
                        department: empData?.department || 'Unknown',
                        position: empData?.position || 'Unknown',
                        branch: empData?.branch || 'Unknown',
                        group: empData?.group || 'Unknown',
                    };
                    return acc;
                }, {});

                // ดึงข้อมูลยอดวิวสำหรับ media แต่ละตัวใน post
                const mediaPublicIds = posts.flatMap(post => post.medias.map(media => media.public_id));
                const libraryViews = await LibraryView.find({ public_id: { $in: mediaPublicIds } });

                const libraryViewMap = libraryViews.reduce((acc, view) => {
                    acc[view.public_id] = view.views;
                    return acc;
                }, {});

                const postData = posts.map(post => {
                    const mediaViews = post.medias.reduce((sum, media) => {
                        return sum + (libraryViewMap[media.public_id] || 0);
                    }, 0);

                    return {
                        ...post._doc,
                        userId: userMap[post.userId],
                        commentCount: post.comments.length,
                        likeCount: post.likes.length,
                        views: mediaViews
                    };
                });

                res.status(200).json({ success: true, data: postData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}

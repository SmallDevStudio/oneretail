import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const comments = await SurveyComments.find({});
                const userIds = comments.map(comment => comment.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select("userId fullname pictureUrl");
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const commentMap = comments.reduce((acc, comment) => {
                    const user = userMap[comment.userId];
                    acc[comment.id] = { ...comment.toObject(), user };
                    return acc;
                }, {});

                res.status(200).json({ success: true, data: commentMap });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;


        case "POST":
            try {
                const comment = await SurveyComments.create(req.body);
                res.status(201).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const comment = await SurveyComments.findByIdAndUpdate(id, data, { new: true, runValidators: true });
                if (!comment) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.query;
                const comment = await SurveyComments.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import ContentViews from "@/database/models/ContentViews";
import ContentComment from "@/database/models/ContentComment";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();
    switch (method) {
        case "GET":
            try {
                const { userId } = req.query;
                const contents = await Content.find({ userId }).populate("categoryId");
                res.status(200).json({ contents });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}
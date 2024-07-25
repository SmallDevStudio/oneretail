import connectMongoDB from "@/lib/services/database/mongodb";
import Article from "@/database/models/Article";

export default async function handler(req, res) {
    const { method, query: { id }, body } = req;

    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const article = await Article.findById(id);
                if (!article) {
                    return res.status(404).json({ success: false, message: "Article not found" });
                }
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'PUT':
            // update article
            console.log(body);
            try {
                const article = await Article.findByIdAndUpdate(id, body, {
                    new: true,
                    runValidators: true,
                });
                if (!article) {
                    return res.status(404).json({ success: false, message: "Article not found" });
                }
                res.status(200).json({ success: true, data: article });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const article = await Article.findByIdAndDelete(id);
                if (!article) {
                    return res.status(404).json({ success: false, message: "Article not found" });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import QuestionnaireComments from "@/database/models/QuestionnaireComments";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const comments = await QuestionnaireComments.find();
                res.status(200).json({ success: true, data: comments });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "POST":
            try {
                const comment = await QuestionnaireComments.create(req.body);
                res.status(201).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { commentId } = req.query;
                const { comment } = req.body;
                const newComment = await QuestionnaireComments.findByIdAndUpdate(commentId, {comment}, { new: true });
                res.status(200).json({ success: true, data: newComment });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const { commentId } = req.query;
                const comment = await QuestionnaireComments.findByIdAndDelete({ _id: commentId });
                res.status(200).json({ success: true, data: comment });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
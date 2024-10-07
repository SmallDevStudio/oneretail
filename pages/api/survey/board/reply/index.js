import connetMongoDB from "@/lib/services/database/mongodb";
import SurveyComments from "@/database/models/SurveyComments";
import SurveyReply from "@/database/models/SurveyReply";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "POST":
    try {
        // Create a new reply
        const reply = await SurveyReply.create(req.body);

        // Update the comment by pushing the new reply's ID
        const updatedComment = await SurveyComments.findByIdAndUpdate(
            req.body.commentId,
            { $push: { reply: reply._id } },
            { new: true } // Return the updated document
        );

        res.status(201).json({ success: true, data: reply });
        } catch (error) {
            console.error("Error adding reply:", error);
            res.status(400).json({ success: false, error: error.message });
        }
        break;

        case "PUT":
            try {
                const { id, ...data } = req.body;
                const reply = await SurveyReply.findByIdAndUpdate(id, data, {
                    new: true,
                    runValidators: true,
                });
                if (!reply) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: reply });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
import connetMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";
import UseForms from "@/database/models/UseForms";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    const { formId } = req.query;

    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const form = await Forms.findById(formId);
                if (!form) {
                    return res.status(404).json({ success: false, message: "Form not found" });
                }

                const answers = await UseForms.find({ formId });
                if (!answers) {
                    return res.status(404).json({ success: false, message: "Answers not found" });
                }
                const userIds = answers.map(answer => answer.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role empId');
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedAnswers = answers.map((answer) => {
                    const user = userMap[answer.userId];
                    return {
                        ...answer.toObject(),
                        user
                    };
                });

                const populatedForm = {
                    ...form._doc,
                    answers: populatedAnswers
                };

                res.status(200).json({ success: true, data: populatedForm });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const answers = await UseForms.deleteMany({ formId });
                res.status(200).json({ success: true, data: answers });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
    
        default:
            res.status(400).json({ success: false });
            break;
    }
}
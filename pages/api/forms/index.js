import connetMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const forms = await Forms.find().sort({ createdAt: -1 });
                const userIds = forms.map(form => form.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role empId');

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const populatedForms = forms.map((form) => {
                    const user = userMap[form.userId];
                    return { 
                        ...form.toObject(), 
                        user 
                    };
                });
               
                res.status(200).json({ success: true, data: populatedForms });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case "POST":
            const { title, description, youtube, image, teamGrop, group, fields, userId } = req.body;
            try {
                const form = await Forms.create({
                    title,
                    description,
                    youtube,
                    image,
                    fields,
                    teamGrop,
                    group,
                    userId,
                });

                res.status(201).json({ success: true, data: form });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}
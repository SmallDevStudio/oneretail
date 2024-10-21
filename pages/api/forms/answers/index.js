import connetMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";
import UseForms from "@/database/models/UseForms";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const { formId } = req.query;
                const form = await Forms.findOne({ _id: formId });


                res.status(200).json({ success: true, data: form });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        case "POST":
            try {
                const answer = await UseForms.create(req.body);
                res.status(201).json({ success: true, data: answer });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
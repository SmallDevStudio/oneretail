import connetMongoDB from "@/lib/services/database/mongodb";
import Forms from "@/database/models/Forms";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const form = await Forms.findById(id);
                res.status(200).json({ success: true, data: form });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { ...data } = req.body;
                const form = await Forms.findById(id);
                if (!form) {
                    return res.status(404).json({ success: false, message: "Form not found" });
                }

                const updatedForm = await Forms.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json({ success: true, data: updatedForm });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                const form = await Forms.findByIdAndDelete(id);
                res.status(200).json({ success: true, data: form });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
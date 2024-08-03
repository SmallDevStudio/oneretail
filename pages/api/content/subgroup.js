import connetMongoDB from "@/lib/services/database/mongodb";
import SupGroup from "@/database/models/SubGroup";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const supgroup = await SupGroup.find().populate('groupId');
                res.status(200).json({ success: true, data: supgroup });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const supgroup = await SupGroup.create(req.body);
                res.status(201).json(supgroup);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const { id, ...data } = req.body;
                const supgroup = await SupGroup.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(supgroup);
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                const supgroup = await SupGroup.findByIdAndDelete(req.body.id);
                res.status(200).json(supgroup);
            } catch (error) {
                res.status(400).json({ success: false });
            }
        default:
            res.status(400).json({ success: false });
            break;
    }
}
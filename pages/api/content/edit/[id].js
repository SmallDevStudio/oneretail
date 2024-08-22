import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method, query } = req;
    const { id } = query;

    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const content = await Content.findById(id)
                    .populate("categories")
                    .populate("subcategories")
                    .populate("groups")
                    .populate("subgroups");

                res.status(200).json(content);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
         case "PUT":
            try {
                const data = req.body;

                // ตรวจสอบค่าที่จะอัปเดตให้ถูกต้อง
                if (!data.categories) data.categories = null;
                if (!data.subcategories) data.subcategories = null;
                if (!data.groups) data.groups = null;
                if (!data.subgroups) data.subgroups = null;

                const content = await Content.findByIdAndUpdate(id, data, { new: true });
                res.status(201).json(content);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: "Invalid request method" });
            break;
    }
}

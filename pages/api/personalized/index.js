import connetMongoDB from "@/lib/services/database/mongodb";
import ContentGen from "@/database/models/ContentGen";
import Content from "@/database/models/Content";
import Category from "@/database/models/Category";
import Subcategory from "@/database/models/Subcategory";
import Group from "@/database/models/Group";
import SubGroup from "@/database/models/SubGroup";

export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();
    switch (method) {
        case "GET":
            try {
                const content = await ContentGen.find({ active: true })
                .sort({ createdAt: -1 })
                .populate('contents');
                
                if (!content) {
                    return res.status(200).json({ success: true, data: [] });
                }

                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
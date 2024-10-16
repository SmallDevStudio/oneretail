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
                const contentGen = await ContentGen.find().sort({ createdAt: -1 });

                if (!contentGen) {
                    return res.status(404).json({ success: false, message: "Content not found" });
                }
                // ส่งข้อมูลกลับไปยัง client
                res.status(200).json({ success: true, data: contentGen });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
import connetMongoDB from "@/lib/services/database/mongodb";
import ContentGen from "@/database/models/ContentGen";
import Content from "@/database/models/Content";

export const config = {
    api: {
        responseLimit: false,
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                // ดึงข้อมูลจาก ContentGen
                const contentGen = await ContentGen.findOne({ _id: id });

                if (!contentGen) {
                    return res.status(404).json({ success: false, message: 'Content not found' });
                }

                // ดึงข้อมูล Content ที่เกี่ยวข้องกับ contents array
                const contentList = await Content.find({
                    _id: { $in: contentGen.contents }
                });

                // สร้าง response data ที่รวมทั้งข้อมูลจาก ContentGen และ Content
                const responseData = {
                    ...contentGen.toObject(), // เอาข้อมูลจาก contentGen มาใส่
                    contentsData: contentList // ใส่ข้อมูล content ที่ดึงมา
                };

                // ส่งข้อมูลกลับไปยัง client
                res.status(200).json({ success: true, data: responseData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { name, contents, active } = req.body;
                const content = await ContentGen.findByIdAndUpdate(
                    id, {
                        name,
                        contents,
                        active
                    }, {
                    new: true,
                    runValidators: true
                });
                res.status(200).json({ success: true, data: content });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const content = await ContentGen.findByIdAndDelete(id);
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
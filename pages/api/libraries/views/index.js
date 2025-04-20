import connectMongoDB from "@/lib/services/database/mongodb";
import LibraryView from "@/database/models/LibraryView";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "POST":
            try {
                const { userId, publicId } = req.body;

                // ค้นหาเอกสารที่ตรงกับ public_id
                let libraryView = await LibraryView.findOne({ public_id: publicId });

                if (libraryView) {
                    // ถ้ามีอยู่แล้ว อัปเดตรายการดู
                    libraryView.user.push({ userId }); // เพิ่มผู้ใช้ซ้ำได้
                    libraryView.views += 1; // เพิ่มจำนวนการดู
                    await libraryView.save();
                } else {
                    // ถ้ายังไม่มี ให้สร้างใหม่
                    libraryView = await LibraryView.create({
                        public_id: publicId,
                        user: [{ userId }],
                        views: 1,
                    });
                }

                // ส่งคำตอบกลับไปที่ client
                res.status(201).json({ success: true, data: libraryView });

            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        case "GET":
            try {
                const libraryViews = await LibraryView.find();
                res.status(200).json({ success: true, data: libraryViews });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}

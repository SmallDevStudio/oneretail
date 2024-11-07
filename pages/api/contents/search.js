import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            try {
                const { search, page } = req.query; // รับค่า query parameter

                // สร้าง query object
                const query = {};

                // ถ้ามี search parameter ให้เพิ่มเงื่อนไขค้นหา title ที่ตรงกับ search
                if (search) {
                    query.title = { $regex: search, $options: 'i' };
                }

                // ถ้ามี page parameter ให้เพิ่มเงื่อนไขแสดงเฉพาะ categories ที่มาจาก page
                if (page) {
                    query.categories = { $in: [page] };
                }
    
    
                const contents = await Content.find(query)
                    .populate('categories')
                    .populate('subcategories')
                    .populate('groups')
                    .populate('subgroups');
    
                res.status(200).json({ success: true, data: contents });
            } catch (error) {
                console.error('Error fetching content:', error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }
}

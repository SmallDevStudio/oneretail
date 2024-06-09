import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { categoryId } = req.query;
                const contents = await Content.find({ categories: categoryId });
                console.log('contents:', contents);

                if (contents.length === 0) {
                    return res.status(404).json({ success: false, message: 'No content found' });
                }

                const randomContent = contents[Math.floor(Math.random() * contents.length)];
                res.status(200).json({ success: true, data: randomContent });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}


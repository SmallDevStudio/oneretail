// api/contents
import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        try {
            const contents = await Content.find({})
            .sort({ createdAt: -1 })
            .populate('categories')
            .populate('subcategories')
            .populate('groups')
            .limit(10);
            res.status(200).json(contents);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }

    if (req.method === "POST") {
        console.log("Request body:", req.body);

        const { title, description, slug, author, categories, subcategories, groups, subgroups, pinned, recommend } = req.body;

        if (!title || !description || !slug || !author) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        const sanitizedData = {
            ...req.body,
            categories: categories || null,
            subcategories: subcategories || null,
            groups: groups || null,
            subgroups: subgroups || null,
            pinned: pinned === '' ? false : pinned,
            recommend: recommend === '' ? false : recommend,
        };

        try {
            const content = await Content.create(sanitizedData);
            res.status(201).json(content);
        } catch (error) {
            console.error("Error creating content:", error);
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

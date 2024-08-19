import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method, query } = req;
    const { id } = query;

    await connectMongoDB();

    if (method !== 'PUT') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    try {
      const { title, description, categories, subcategories, groups,subgroups, publisher, point, coins, tags, pinned, recommend } = req.body;

        const content = await Content.findById(id);

        if (!content) {
          return res.status(404).json({ success: false, error: 'Content not found' });
        }

        // Update content fields, excluding likes
        content.title = title;
        content.description = description;
        content.categories = categories;
        content.subcategories = subcategories;
        content.groups = groups;
        content.subgroups = subgroups;
        content.publisher = publisher === '' ? false : publisher,
        content.point = point;
        content.coins = coins;
        content.tags = typeof tags === 'string' ? tags.split(' ').filter(tag => tag) : tags; // Convert space-separated string to array
        content.pinned = pinned === '' ? false : pinned,
        content.recommend = recommend === '' ? false : recommend
        
        // Save the updated content
        await content.save();

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(400).json({ success: false, error: error.message });
    }
}

import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method, query } = req;
    const { id } = query;

    await connetMongoDB();

    if (method !== 'PUT') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }
    
      try {
        const {
          userId,
          title,
          description,
          youtubeUrl,
          thumbnailUrl,
          categories,
          subcategories,
          groups,
          publisher,
          point,
          coins,
          tags
        } = req.body;

        const content = await Content.findById(id);

        if (!content) {
          return res.status(404).json({ success: false, error: 'Content not found' });
        }

        // Update content fields, excluding likes
        content.title = title;
        content.description = description;
        content.youtubeUrl = youtubeUrl;
        content.thumbnailUrl = thumbnailUrl;
        content.categories = categories;
        content.subcategories = subcategories;
        content.groups = groups;
        content.publisher = publisher;
        content.point = point;
        content.coins = coins;
        content.tags = tags.split(' ').filter(tag => tag); // Convert space-separated string to array

        await content.save();

        res.status(200).json({ success: true, data: content });
      } catch (error) {
        console.error('Error updating content:', error);
        res.status(400).json({ success: false, error: error.message });
      }

}